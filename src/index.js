import QuotesWidget from "./quoteswidget";

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