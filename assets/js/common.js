const common =
    {
        goods: [
            {
                idx: 1,
                name: "응원봉 ver.2",
                img: "./assets/images/goods/01.png",
                price: 45000,
            },
            {
                idx: 2,
                name: "미니 라이트 키링 ver.2",
                price: 20000,
            },
            {
                idx: 3,
                name: "응원봉 우비",
                price: 22000,
            },
            {
                idx: 4,
                name: "인형용 헤어밴드",
                price: 15000,
            },
            {
                idx: 5,
                name: "응원봉 봉제키링",
                price: 15000,
            },
            {
                idx: 6,
                name: "볼캡",
                options: [
                    {
                        type: "color",
                        option: ["Black", "Skyblue"],
                    },
                ],
                price: 32000,
            },
            {
                idx: 7,
                name: "바람막이",
                price: 89000,
            },
            {
                idx: 8,
                name: "티셔츠",
                options: [
                    {
                        type: "color",
                        option: ["White", "Black"],
                    },
                    {
                        type: "size",
                        option: ["L", "XL"],
                    },
                ],
                price: 42000,
            },
            {
                idx: 9,
                name: "숄더백",
                price: 53000,
            },
            {
                idx: 10,
                name: "반지",
                price: 49000,
            },
            {
                idx: 11,
                name: "핸드타올",
                price: 13000,
            },
            {
                idx: 12,
                name: "쉬폰 패브릭 포스터",
                price: 28000,
            },
            {
                idx: 13,
                name: "필름 포토",
                price: 10000,
            },
            {
                idx: 14,
                name: "미니 포토북",
                price: 18000,
            }
        ],
        init: function () {
        },

        convertGoodHtml: function (item) {
            let textIdx = item.idx < 10 ? '0' + item.idx : item.idx;
            let html = ``;
            html += `<div class="col item-card" data-idx="${item.idx}">`;
            html += `<img src="./assets/images/goods/${textIdx}.png?v=24092301">`;
            html += `<div class="name">${item.name}</div>`;
            html += `<div class="price" data-price="${item.price}">${item.price.toLocaleString()}원</div>`;
            // option 추가
            if (item.options !== undefined) {
                html += `<div class="options">`;
                html += `<div class="option input-group option${item.idx}">`;
                $(item.options).each(function (index) {
                    let option = item.options[index];
                    html += `<select class="custom-select" name="${item.idx}[${option.type}][]">`;
                    $(option.option).each(function (index) {
                        let optionItem = option.option[index];
                        html += `<option value="${optionItem}">${optionItem}</option>`;
                    });
                    html += `</select>`;
                });
                html += `<select class="custom-select qty qty-option" name="option[${item.idx}]['qty'][]">`;
                html += common.bindQtyOptions();
                html += `</select>`;
                html += `<button type="button" class="add btn btn-sm btn-outline-secondary" data-idx="${item.idx}">추가</button>`;
                html += `</div>`;
            } else {
                html += `<select class="custom-select qty" name="option[${item.idx}]['qty']">`;
                html += common.bindQtyOptions();
                html += `</select>`;
            }
            html += `</div>`;
            html += `</div>`;
            return html;
        },
        bindQtyOptions: function (length = 0) {
            let html = ``;
            for (int in Array.from(Array(length == 0 ? 4 : length).keys())) {
                html += `<option value="${int}">${int}</option>`;
            }

            return html;
        },
        setGoods: function (element) {
            let html = ``;
            $(this.goods).each(function (index) {
                let item = common.goods[index];
                html += common.convertGoodHtml(item);
            });

            element.html(html);
        },
        cloneOption: function (element) {
            let idx = element.attr('data-idx');
            let clone = $(`.option${idx}`).last().clone();
            clone.children('.add').remove();
            clone.append(`<button type="button" class="remove btn btn-sm btn-outline-danger" data-idx="${idx}">X</button>`);
            let originSelects = element.parent().find('select');
            clone.find('select').each(function (index) {
                $(this).val(originSelects.eq(index).val());
            });

            element.parents('.options').prepend(clone);
            common.calcAmount();
        },
        calcAmount : function () {
            let amount = 0;

            $('select.qty').each(function (index) {
                let select = $(this);
                let parent = select.parents('.item-card');
                let qty = parseInt(select.val());

                if (qty == 0) {
                    return;
                }

                if (select.hasClass('qty-option')) {
                    let optionParent = select.parents('.option');
                    if (optionParent.has('.add').length > 0) {
                        return;
                    }
                }

                let price = parent.find('.price').attr('data-price');
                let totalPrice = qty * price;

                amount += totalPrice;
            });
            $('#amountInfo .amount').html(amount.toLocaleString() + '원');
            $('#amountInfo .gift').html((parseInt(amount / 50000)).toLocaleString() + '개');
        },
        saveImage: function () {
            let html = ``;
            let amount = 0;

            $('select.qty').each(function (index) {
                let select = $(this);
                let parent = select.parents('.item-card');
                let qty = parseInt(select.val());

                if (qty == 0) {
                    return;
                }

                let name = parent.find('.name').text();
                let img = parent.find('img').attr('src');

                if (select.hasClass('qty-option')) {
                    let optionParent = select.parents('.option');
                    if (optionParent.has('.add').length > 0) {
                        return;
                    }

                    let optionText = ``;
                    $(optionParent).find('select').not('.qty').each(function () {
                        let value = $(this).val();
                        if (optionText != '') {
                            optionText += '/';
                        }

                        optionText += value;
                    });

                    if (optionText != '') {
                        name += ` (${optionText})`;
                    }
                }

                let price = parent.find('.price').attr('data-price');
                let totalPrice = qty * price;

                amount += totalPrice;

                html += `<div class="item clearfix">`;
                html += `<span class="left"><img src="${img}"></span>`;
                html += `<span class="left">${name}</span>`;
                html += `<span class="right">`;
                html += `<span class="price">${qty}*${price.toLocaleString()}</span>`;
                html += `<span class="total">${(totalPrice).toLocaleString()}원</span>`;
                html += `</span>`;
                html += `</div>`;
            });
            $('#amountInfo .amount').html(amount.toLocaleString() + '원');
            $('#amountInfo .gift').html((parseInt(amount / 50000)).toLocaleString() + '개');

            $('#wrapItems').hide();
            $('#itemList').html(html).show();
            $('.signature').show();

            html2canvas(document.querySelector('#receipt')).then(function (canvas) {
                console.log(canvas);
                $('#preview').append(`<img src="` + canvas.toDataURL("image/png", 1.0) + `">`).show();
                $('.image-btn a').attr('href', canvas.toDataURL("image/png", 1.0));
                $('#receipt').hide();
                $('.preview-btn').hide();
                $('.image-btn').show();
            });
        }
    }
