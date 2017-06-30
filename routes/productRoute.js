var express = require('express');
var product = require('../models/product');
var account = require('../models/account');

var productRoute = express.Router();

productRoute.get('/byCat/:id', function(req, res) {

    // product.loadAllByCat(req.params.id)
    //     .then(function(list) {
    //         res.render('product/byCat', {
    //             layoutModels: res.locals.layoutModels,
    //             products: list,
    //             isEmpty: list.length === 0,
    //             catId: req.params.id
    //         });
    //     });

    var rec_per_page = 4;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    product.loadPageByCat(req.params.id, rec_per_page, offset)
        .then(function(data) {

            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: i === +curPage
                });
            }

            res.render('product/byCat', {
                layoutModels: res.locals.layoutModels,
                products: data.list,
                isEmpty: data.total === 0,
                catId: req.params.id,

                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,
            });
        });
});

productRoute.get('/detail/:id', function(req, res) {

    if (!req.session.isLogged) {
        product.loadDetail(req.params.id, false, null)
        .then(function(pro) {
            if (pro) {
                var tt = 'Đã qua sử dụng';
                if (pro.trangthai.lastIndexOf(1) === -1)
                    tt = 'Chưa qua sử dụng';
                res.render('product/detail', {
                    layoutModels: res.locals.layoutModels,
                    product: pro,
                    watching: 'Theo dõi',
                    trangthai: tt
                });
            } else {
                res.redirect('/home');
            }
        });
    }
    else {
        product.loadDetail(req.params.id, true, req.session.account.id)
        .then(function(pro) {
            if (pro) {
                var tt = 'Đã qua sử dụng';
                if (pro.pro.trangthai.lastIndexOf(1) === -1)
                    tt = 'Chưa qua sử dụng';
                res.render('product/detail', {
                    layoutModels: res.locals.layoutModels,
                    product: pro.pro,
                    watching: pro.watching,
                    trangthai: tt
                });
            } else {
                res.redirect('/home');
            }
        });
    }
});

productRoute.post('/detail/:id', function(req, res) {
    if (req.session.isLogged === true) {
        product.insertTheoDoi(req.session.account.id, req.params.id)
        .then(function() {
            product.loadDetail(req.params.id, req.session.isLogged, req.session.account.id)
            .then(function(pro) {
                if (pro) {
                    if (!req.session.isLogged) {
                        res.render('product/detail', {
                            layoutModels: res.locals.layoutModels,
                            product: pro
                        });
                    }
                    else {
                        res.render('product/detail', {
                            layoutModels: res.locals.layoutModels,
                            product: pro.pro,
                            watching: pro.watching
                        });
                    }
                } else {
                    res.redirect('/home');
                }
            });
        });

    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

productRoute.get('/bid/:id', function(req, res) {
    if (req.session.isLogged === true) {
        account.loadAccountbyId(req.session.account.id)
        .then(function(acc) {
            if (acc) {
                var cong = acc.diemcong;
                var tru = acc.diemtru;
                console.log(cong);
                console.log(tru);
                console.log(cong / (cong + tru) <= 0.8);
                if ((cong !== 0 || tru !== 0) && (cong / (cong + tru) <= 0.8)) {
                    res.render('product/cannotbid', {
                        layoutModels: res.locals.layoutModels,
                        lydo:" Điểm cộng thấp hơn 80%."
                    });
                } else {
                    product.loadCamDauGia(req.session.account.id, req.params.id)
                    .then(function(row) {
                        if (row.length > 0) {
                            res.render('product/cannotbid', {
                                layoutModels: res.locals.layoutModels,
                                lydo: 'Bị cấm bởi người bán sản phẩm.'
                            });
                        }
                        else {
                            product.loadHetHan(req.params.id)
                            .then(function(row) {
                                if (row.length > 0) {
                                    res.render('product/cannotbid', {
                                        layoutModels: res.locals.layoutModels,
                                        lydo: 'Phiên đấu giá đã kết thúc.'
                                    });
                                } else {
                                    product.loadProductbyId(req.params.id)
                                    .then(function(pro) {
                                        if (pro) {
                                            res.render('product/bid', {
                                                layoutModels: res.locals.layoutModels,
                                                product: pro
                                            });
                                        } else {
                                            res.redirect('/home');
                                        }
                                    });
                                }
                            }); 
                        }
                    });
                }
            } else {
                res.redirect('/home');
            }                      
        });
    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

productRoute.post('/bid/:id', function(req, res) {
    var entity = {
        giaphaitra: req.body.giaphaitra,
        nguoigiugia: req.session.account.id
    };

    product.insertTraGia(req.session.account.id, req.params.id, entity)
        .then(function() {

            product.loadProductbyId(req.params.id).then(function(row) {
                //Gửi email xác nhận cho người mua đã trả giá thành công
                var mailToBidder = {
                    from: "Web Auction <myauctionwebapp@gmail.com>", // sender address
                    to: res.locals.layoutModels.account.email, // list of receivers
                    subject: "Thông báo trả giá thành công", // Subject line
                    text: "Bạn đã trả giá thành công cho sản phẩm " + row.tensp + " với giá là " + req.body.giaphaitra + " vnd.", // plaintext body
                };
                console.log(mailToBidder);
                smtpTransport.sendMail(mailToBidder, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                });

                //Gửi email thông báo có người trả giá cho người bán
                product.loadSellerByProductId(req.params.id).then(function(rowSeller) {
                    var mailToSeller = {
                        from: "Web Auction <myauctionwebapp@gmail.com>", // sender address
                        to: rowSeller.email, // list of receivers
                        subject: "Thông báo sản phẩm đã được trả giá", // Subject line
                        text: "Tài khoản " + res.locals.layoutModels.account.name + " vừa trả giá " + req.body.giaphaitra + " vnd cho sản phẩm " + row.tensp + " của bạn."
                    };
                    console.log(mailToSeller);
                    smtpTransport.sendMail(mailToSeller, function(error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }
                    });
                });
                smtpTransport.close();
            });

            product.updateDatGiaHienTai(req.params.id, entity)
                .then(function() {
                    res.redirect('/product/detail/' + req.params.id);
                });
        });
});

productRoute.get('/bidlog/:id', function(req, res) {
    product.loadBidLogById(req.params.id)
    .then(function(rows) {
        res.render('product/bidlog', {
            layoutModels: res.locals.layoutModels,
            tragia: rows,
            empty: rows.length === 0
        });   
    });
});

productRoute.post('/bidlog/:id', function(req, res) {
    product.deleteTraGia(req.body.gia, req.params.id)
    .then(function() {
        product.insertCamDauGia(req.body.gia, req.params.id)
        .then(function() {
            product.loadTraGia(req.params.id)
            .then(function(row) {
                product.updateNguoiGiuGia(row.nguoitragia, req.params.id, row.gia)
                .then(function() {
                    res.redirect('/product/bidlog/' + req.params.id);
                });
            });
        });
    });
});

productRoute.post('/buynow/:id', function(req, res) {
    if (req.session.isLogged === true) {
        account.loadAccountbyId(req.session.account.id)
        .then(function(acc) {
            if (acc) {
                var cong = acc.diemcong;
                var tru = acc.diemtru;
                console.log(cong);
                console.log(tru);
                console.log(cong / (cong + tru) <= 0.8);
                if ((cong !== 0 || tru !== 0) && (cong / (cong + tru) <= 0.8)) {
                    res.render('product/cannotbid', {
                        layoutModels: res.locals.layoutModels,
                        lydo:" Điểm cộng thấp hơn 80%."
                    });
                } else {
                    product.loadCamDauGia(req.session.account.id, req.params.id)
                    .then(function(row) {
                        if (row.length > 0) {
                            res.render('product/cannotbid', {
                                layoutModels: res.locals.layoutModels,
                                lydo: 'Bị cấm bởi người bán sản phẩm.'
                            });
                        }
                        else {
                            product.loadHetHan(req.params.id)
                            .then(function(row) {
                                if (row.length > 0) {
                                    res.render('product/cannotbid', {
                                        layoutModels: res.locals.layoutModels,
                                        lydo: 'Phiên đấu giá đã kết thúc.'
                                    });
                                } else {
                                    product.updateSanPhamMuaNgay(req.session.account.id, req.params.id)
                                    .then(function() {
                                        product.loadProductbyId(req.params.id)
                                        .then(function(pro) {
                                            if (pro) {
                                                
                                                var entity = {
                                                    giaphaitra: pro.giamuangay,
                                                    nguoigiugia: req.session.account.id
                                                };

                                                product.insertTraGia(req.session.account.id, req.params.id, entity)
                                                .then(function() {

                                                    product.updateDatGiaHienTai(req.params.id, entity)
                                                    .then(function() {
                                                        res.redirect('/product/detail/' + req.params.id);
                                                    });
                                                });

                                            } else {
                                                res.redirect('/home');
                                            }
                                        });
                                    });
                                }
                            }); 
                        }
                    });
                }
            } else {
                res.redirect('/home');
            }                      
        });
    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

module.exports = productRoute;
