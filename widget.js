(function() {
    function QuotesWidget( el ) {


        this.addClass = function( el, c ) {
            let classes = el.getAttribute("class") !== undefined && el.getAttribute("class") !== null ? el.getAttribute("class").split(" ") : [];
            if ( !classes.includes( c ) ) {
                classes.push( c );
            }
            el.setAttribute("class", classes.join(" ") );
            return el;
        }

        this.getVar = function( varname, default_value ) {
            return this.el.dataset[varname] !== undefined && this.el.dataset[varname] !== null && this.el.dataset[varname] !== "" ? this.el.dataset[varname] : default_value;
        };

        this.el = this.addClass(el, "qw-container");
        if ( this.getVar("vertical", "0") === "0" ) {
            this.el = this.addClass(el, "qw-horizontal");
        } else {
            this.el = this.addClass(el, "qw-vertical");
        }

        this.coins = [];
        this.data = {};
        this.height = this.getVar("height","25px");
        this.width = this.getVar("width","50%");
        this.quote = this.getVar("quote","usd");
        this.vertical = parseInt( this.getVar("vertical", "0") );
        this.slider_duration = this.getVar("sliderduration", "0" );
        this.slider_interval = this.getVar("sliderinterval", "0" );


        this.formatMoney = function (amount, decimalCount = 2, decimal = ".", thousands = ",") {
            try {
                decimalCount = Math.abs(decimalCount);
                decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

                const negativeSign = amount < 0 ? "-" : "";

                let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
                let j = (i.length > 3) ? i.length % 3 : 0;

                return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
            } catch (e) {
                console.log(e)
            }
        };


        this.updateColumnWidth = function ( selector ) {
            let items = this.el.getElementsByClassName( selector );
            if ( items.length > 0 ) {
                let max_width = 0;
                for( let i =0; i < items.length; i++ ) {
                    if ( parseInt( items[i].offsetWidth ) > max_width ) {
                        max_width =  parseInt( items[i].offsetWidth );
                    }
                }
                for(let i =0; i < items.length; i++) {
                    items[i].setAttribute("style", "width:"+max_width+"px");
                }
            }
        }

        this.getLineWidth = function() {
            let l_width = 0;
            let items = this.el.getElementsByClassName("qw-item");
            if ( items.length > 0 ) {
                for( let i =0; i < items.length; i++ ) {
                    l_width  +=  parseInt( items[i].offsetWidth );
                }
            }
            return l_width;
        }

        this.last_item_index = 0;

        this.scroll_ = function( el, to ) {
            el.scrollLeft = to;
        }

        this.animate_scroll = function( el, from, to, time ) {
            let steps =  from > to ? from - to : to - from;
            let delay = time / steps;

            if ( from > to ) {
                for (let next_offset = from; next_offset > to; next_offset--) {
                    setTimeout(this.scroll_, delay, el, next_offset);
                }
            } else {
                for (let next_offset = from; next_offset < to; next_offset++) {
                    setTimeout(this.scroll_, delay, el, next_offset);
                }
            }
        }

        this.scrolling = true;
        this.stop_slider = function() {
            this.scrolling = false;
        }
        this.start_slider = function() {
            this.scrolling = true;
        }

        this.scroll_items = function() {
            if ( !this.scrolling ) { return ; }
            if ( this.last_item_index+1 < this.el.getElementsByClassName("qw-item").length ) {
                this.last_item_index++;
            } else {
                this.last_item_index = 0;
            }

            if ( this.el.getElementsByClassName("qw-item")[this.last_item_index].offsetLeft < this.getLineWidth() ) {
                let toscroll = this.el.getElementsByClassName("qw-item")[this.last_item_index].offsetLeft - 10;
                this.animate_scroll(this.el, this.el.scrollLeft, toscroll, this.slider_duration );
            } else {
                this.last_item_index = 0;
                this.animate_scroll(this.el, this.el.scrollLeft, 0, this.slider_duration);
            }
        }

        this.draw = function( d ) {
            if ( this.vertical === 1 ) {
                this.el.setAttribute("style", "width:"+this.width );
                let coin_el = this.addClass( document.createElement("div"), "qw-item");
                let icon_el = this.addClass( document.createElement("div"), "qw-item-icon");
                icon_el.innerHTML = "&nbsp;";
                let name_el = this.addClass( document.createElement("div"), "qw-item-name");
                name_el.innerHTML = "<strong>Coin</strong>";
                let rate_el = this.addClass( document.createElement("div"), "qw-item-rate");
                rate_el.innerHTML = "<strong>Rate</strong>";
                let changes_el =this.addClass( document.createElement("div"), "qw-item-changes");
                changes_el.innerHTML = "<strong>24H</strong>";
                coin_el.appendChild( icon_el );
                coin_el.appendChild( name_el );
                coin_el.appendChild( changes_el );
                coin_el.appendChild( rate_el );
                this.el.appendChild( coin_el );
            } else {
                this.el.setAttribute("style", "width:"+this.width );
            }

            this.data = d;
            this.el.getElementsByClassName("qw-preloader")[0].remove();


            for ( let i in this.data ) {
                let coin = this.data[i];

                let coin_el = this.addClass( document.createElement("div"), "qw-item");
                let icon_el = this.addClass( document.createElement("div"), "qw-item-icon");
                let name_el = this.addClass( document.createElement("div"), "qw-item-name");
                let rate_el = this.addClass( document.createElement("div"), "qw-item-rate");
                let changes_el =this.addClass( document.createElement("div"), "qw-item-changes");

                rate_el.innerText = this.formatMoney( parseFloat( coin.current_price ) ) + " " + this.quote.toUpperCase();
                icon_el.innerHTML = '<img src="'+coin.image+'" height="'+this.height.replace("px","") * 0.9+'"/>';
                icon_el.setAttribute("style", "width:"+this.height );
                name_el.innerText = coin.name;

                changes_el.innerText = ( parseFloat( coin.price_change_percentage_24h ) > 0 ? "+" : "") + parseFloat( coin.price_change_percentage_24h).toFixed(3)+"%";
                changes_el = this.addClass( changes_el, parseFloat( coin.price_change_percentage_24h ) > 0 ? "qw-change-positive" : "qw-change-negative");

                coin_el.appendChild( icon_el );
                coin_el.appendChild( name_el );
                coin_el.appendChild( changes_el );
                coin_el.appendChild( rate_el );

                this.el.appendChild( coin_el );
            }
            if ( this.vertical === 1 ) {
                this.updateColumnWidth("qw-item-icon");
                this.updateColumnWidth("qw-item-name");
                this.updateColumnWidth("qw-item-rate");
                this.updateColumnWidth("qw-item-changes");
            } else {
                this.el.onmouseover = function ( e ) {
                    this.stop_slider();
                }.bind(this);
                this.el.onmouseleave = function ( e ) {
                    this.start_slider();
                }.bind(this)
            }
        }

        this.load_data = function() {
            let self = this;
            if ( this.el.dataset["coins"] !== undefined && this.el.dataset["coins"] !== "" ) {
                this.coins = this.el.dataset["coins"].split(',');
            }

            fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+this.quote+"&ids="+this.coins.join(",") )
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    self.draw(jsonResponse);
                });
        }

        this.load_data();
    }

    document.onreadystatechange = function() {
        if (document.readyState === "complete") {
            let items = document.getElementsByClassName("qw-widget");
            let objs = [];
            if ( items.length > 0 ) {
                for( let i =0; i < items.length; i++ ) {
                    items[i].innerHTML = '<div class="qw-preloader loadingio-spinner-spinner-its7avom2gb"><div class="ldio-1f2c0i3u0rq"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
                    let w = new QuotesWidget(items[i] );
                    if ( w.vertical.toString() === "0" && parseInt( w.slider_interval ) > 0 ) {
                        setInterval( w.scroll_items.bind(w), parseInt( w.slider_interval ) );
                    }
                }
            }
        }
    }
})();
