# Quotes widget

### Install

```js
npm i quoteswidget
````

### Include in browser ( before </body> )

```html
<link rel="stylesheet" href="quoteswidget.css">
<script type="application/javascript" src="dist/bundle.js"></script>
```


### Usage

```html
<div data-width="50%" data-quote="usd" data-coins="bitcoin,ethereum,ripple" class="qw-widget">
```

### Params

All params are sets by data attributes of container

#### width

Widget width ( exact value with px or % )

```
data-width="100%"

data-width="275px"
```

#### height

Widget height ( exact value with px or % ) - only for vertical widget

```
data-height="100%"

data-height="275px"
```

#### quote

Quote currency

```
data-quote="rub"

data-quote="usd"
```

#### coins

Comma separated coins list. Display all coins if not set

```
data-coins="etheereum,bitcoin"
```

#### vertical

```
data-vertival="1"
```
