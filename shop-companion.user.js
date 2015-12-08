// ==UserScript==
// @name           Shop Companion
// @namespace      http://www.evrybase.com/addon
// @description    Get full-resolution/largest/xxl/best-size product images and videos on various shopping sites. Bookmark products. More features coming up.
// @version        0.29
var version =      0.29;
// @author         ShopCompanion
// @homepage       http://www.evrybase.com/
// @copyright      2014+, EVRYBASE (http://www.evrybase.com/)
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAO5AAADuQHRCeUsAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAANVQTFRFDwAA8PDw8PDw8PDw8PDw8PDw8PDw8vLy9PT09PT09PT09PT09PT09vb29vb29fX19fX19vb29vb2+Pj4+Pj4+fn5+fn5+Pj4+Pj4+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39AAAAHh4eZWVla2trbW1tcXFxhYWFjo6OlpaWm5ubqamprKyswMDAwsLCxMTEzMzMzc3N19fX4uLi/f39/v7+////B68tFQAAADF0Uk5TAAMEBQcICQkcHR4fIDg5TVFbXYiKj5KXmJiam6+xvL/AwcPGz9bX19jc3uPj5efo6eeeGU4AAADoSURBVDjLlZPnFoIwDEbjXrj3xL23uPfK+z+SoNATUNrj/Zlcekr6BYDhiRcrzcGgWSkmvPBNKD9ExqggWdq+1ARNTFM+2pdqiA/KE7FKDol01W82c8JVLXTCRj/Q1g5dzwgXrdIKfvouGXVhuzO4v0uy+y0k0RBuaCGp9f1je2HsV4Uc2guYBXD0eULfCVHkCRiDNF/IQIkvlKFOhOVK58yEBrSIwDgwoWcSForOiQh1/h0a4ksKf1M4KOGohY8lfm5hYEjkFGPUqxON3K/Q7mlo9dgfFMLRFPvP4lipSv+snnh57df/BbDVyC03lcMOAAAAAElFTkSuQmCC
// @license        GNU GPL License
// @grant          GM_addStyle
// @grant          GM_setValue 
// @grant          GM_getValue

// @include        http://*.albamoda.tld/*
// @includewip     http://www.aldoshoes.com/*
// @include        http://www.amazon.tld/*
// @include        http://www.asos.com/*
// @includewip     http://www.barratts.co.uk/*
// @include        http://www.bata.tld/*
// @include         http://nl.bata.eu/*
// @include        http://www.batashoes.be/*
// @include        http://www.bergdorfgoodman.com/*
// @include        http://www.bershka.com/*
// @includewip     http://*.bloomingdales.com/shop/product/*
// @include       https://www.breuninger.com/*
// @include        http://www.buffalo-shop.de/*
// @include        http://buffalo-shop.de/*
// @include        http://www.deichmann.tld/*
// @includewip     http://www.fashionid.de/*
// @include        http://www.goertz.de/*
// @include        http://www.hallhuber.com/*
// @include        http://www.hm.com/*
// @include        http://www.horchow.com/*
// @include        http://www.justfab.tld/*
// @include        http://*.macys.com/shop/product/*
// @include        http://www.marksandspencer.tld/*
// @include        http://www.neimanmarcus.com/*
// @include        http://www.nelly.tld/*
// @include        http://nelly.tld/*
// @include        http://nlyman.tld/*
// @include        http://www.net-a-porter.com/*
// @include        http://shop.nordstrom.com/s/*
// @includewip     http://www.office.co.uk/*
// @include        http://www.otto.de/*
// @include       https://www.otto.de/*
// @include        http://www.roland-schuhe.de/*
// @include        http://www.sarenza.com/*
// @include        http://www.sarenza.de/*
// @include        http://www.uniqlo.tld/*
// @include        http://www.walmart.com/ip/*
// @include        http://www.yoox.com/*
// @include        http://www.zalando.de/*
// @include        https://www.zalando.de/*
// @include        http://www.zappos.com/*
// @include        http://www.zara.com/*

// @include        http://www.evrybase.com/shop-companion
// @include        https://www.evrybase.com/shop-companion

// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js

// ==/UserScript==

/*
 We set @grant to something other than none to reactivate the sandbox so we don't interfere with on-site jquery
*/

/*
 * This file is a part of the Shop Companion Add-On, which has been placed under
 * the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 *
 * Copyright (c) 2014, evrybase.com
 *
 * For brevity, the full license is omitted here but can be obtained at:
 * http://www.gnu.org/licenses/gpl.txt
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */

'use strict';

if(typeof GM_getValue === "function"){	// we're under a GM compatibility layer
	debug(" using GreaseMonkey storage");
	function storage_set(key,value, callback) { // cb is optional on set
		GM_setValue(key,value);
		callback({ "status": true, "key": key, "value": value }); // storage API compatible arg object
	}
	function storage_get(key, callback) {
		var value = GM_getValue(key);
		if(value == true){ value = "value"; } // on Firefox, versions < 0.25 may have set a boolean, now we always stringify - mimic that
		callback({ "status": true, "key": key, "value": value });
	}
}else{ // we're on Chrome+BabelExt
	debug(" using BabelExt storage");
	// we need to ask for 'storage'-permission in our Chrome manifest.json; which we do but BabelExt doesn't do it out-of-the-box
	// now, that we have that, we wrap the storage api with our own callback-expecting function - which degrades to "no callback expected"
	// when wrapped by Scriptify+Firefox (see above)
	function storage_set(key,value, callback) { // cb is optional on set
		BabelExt.storage.set(key,value,callback);
	}
	function storage_get(key, callback) {
		BabelExt.storage.get(key,callback);
	}
}

var elems	= {}; // Object! for assoc. arrays
elems['images'] = [];

if( location.href.match(/albamoda/) ){
	var meta_pagetype = get_meta_name('WT.cg_n');
	if(meta_pagetype === 'ProductDetailPage'){
	        debug('albamoda product');

		var li_array = $('#imgCarousel').children();

		for(var i = 0; i < li_array.length; i++){
			elems['images'].push({
				url: 'http://albamoda.scene7.com/is/image/AlbaModa/AlbaModa?src=mmo/'+ li_array[i].children[0].getAttribute('id') +'&scl=1',
				style: 'margin: 0; margin-right: 5px;',
				text: 'i'+i
			});
		}

		document.getElementById("contentInfoLinks").appendChild( companion_node(elems) );
	}else{
		debug('albamoda non-product page');
	}

}else if( location.href.match(/amazon/) ){ // todo: mobile amazon doesn't provide us with on-page access to full-size images
	if( $('#handleBuy').is("form") ){
		debug('amazon product page');

		var items = document.getElementsByTagName("script");
		var json;
		if(items.length){
			for (var i = items.length; i--;) {
				if( items[i].innerHTML.indexOf('var colorImages = ') >= 1){
					// debug('found: ' + items[i]);
					var lines = items[i].innerHTML.split(/\r?\n/);
					json = lines[2].match(/colorImages\s=\s([^;]+);/);
					// debug(json[1]);
					break;
				}
			}
		}else{
			debug('amazon image list not avail');
		}

		if(json && json[1]){
			var jsonObj = $.parseJSON(json[1]);
			var array = jsonObj.initial;
			// debug(array);
			for(var i = 0; i < array.length; i++){
				var url;
				if(array[i]['hiRes']){
					// debug(array[i]['hiRes']);
					url = array[i]['hiRes'];
					// replacing SL1500 with something large or undef (simply SL), same as SCRMZZZZZZ
					url = url.replace("SL1500", "SL");
				}else if(array[i]['large']){
					// debug(array[i]['large']);
					url = array[i]['large'];
				}
				if(url){
					elems['images'].push({
						url: url,
						text: 'i'+(i+1)
					});
				}
			}
		}else{
			debug('amazon product page json not avail');
		}

		$('.buyingDetailsGrid tr:last').after('<tr><td>'+ companion_node(elems).innerHTML +'</td></tr>');
	}else if( $('#buybox').length > 0 ){
		if( $('#combinedBuyBox').length > 0 ){
			debug('amazon dynamic product page v2');

			var items = document.getElementsByTagName("script");
			var json;
			if(items.length){
				for (var i = items.length; i--;) {
					if( items[i].innerHTML.indexOf("imageGalleryData") >= 1 ){
						// debug('found: ' + items[i]);
						var lines = items[i].innerHTML.split(/\r?\n/);
						json = lines[63].match(/'imageGalleryData'\s:\s(.+)/);
						json[1] = json[1].substring(0,json[1].length - 1);
						// debug('json',json[1]);
						break;
					}
				}
			}else{
				debug('amazon image list not avail');
			}

			if(json && json[1]){
				var array = $.parseJSON(json[1]);
				debug(array);
				for(var i = 0; i < array.length; i++){
					var url;
					if(array[i]['mainUrl']){
						url = array[i]['mainUrl'];
					}
					if(url){
						elems['images'].push({
							url: url,
							text: 'i'+(i+1)
						});
					}
				}
			}else{
				debug('amazon product page json not avail');
			}
		}else{
			debug('amazon dynamic product page v1'); // also used for mobile devices

			var items = document.getElementsByTagName("script");
			var json;
			var video_url;
			if(items.length){
				for (var i = items.length; i--;) {
					if( items[i].innerHTML.indexOf("colorImages': { 'initial") >= 1){
						// debug('found: ' + items[i]);
						var lines = items[i].innerHTML.split(/\r?\n/);

						// debug('lines: ',lines);
						var line;
						for(var l = 50; l < lines.length; l++){
							if( lines[l].match(/colorImages/) ){
								line = lines[l];
							}
						}

						json = line.match(/'initial':\s(.+)/);
						json[1] = json[1].substring(0,json[1].length - 2);
						debug('json',json[1]);
					//	break;
					}else if( items[i].innerHTML.indexOf('.mp4",') >= 1 ){
						// debug("found video");
					
						video_url = items[i].innerHTML.match(/"url":"([^"]+)","/);
						// debug(video_url);
					}
				}
			}else{
				debug('amazon image list not avail');
			}

			if(json && json[1]){
				var array = $.parseJSON(json[1]);

				debug(array);
				for(var i = 0; i < array.length; i++){
					var url;
					if(array[i]['hiRes']){
						// debug(array[i]['hiRes']);
						url = array[i]['hiRes'];
						// replacing SL1500 (here UL1500) with something large or undef (simply SL), same as SCRMZZZZZZ
						url = url.replace("UL1500", "SL");
					}else if(array[i]['large']){
						// debug(array[i]['large']);
						url = array[i]['large'];
					}
					if(url){
						elems['images'].push({
							url: url,
							text: 'i'+(i+1)
						});
					}
				}
				if(video_url && video_url[1]){
					elems['images'].push({
						url: video_url[1],
						text: 'video'
					});
				}
			}else{
				debug('amazon product page json not avail');
			}
		}

		var $target = $('#rightCol');
		if( $target.length > 0 ){
			// we need a wrapper div for alignment
			var wrapper = document.createElement('div');
			wrapper.setAttribute("style", "position: relative; width: 270px; left: -25px; font-size: 0.9em;");
			wrapper.appendChild( companion_node(elems) );

			$target.append( wrapper );
		}else{
			$target = $("#aboutThisItem_feature_div");
			if( $target.length > 0 ){
				debug("amazon mobile view");
				$target.before( companion_node(elems) );
			}
		}
	}else{
		debug('amazon non-product page');
	}

}else if( location.href.match(/asos/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('asos product');

		var link = meta_image.replace("xl.jpg", "xxl.jpg");
		elems['images'].push({
			url: link,
			text: 'i1'
		});
		
		link = link.replace(/\/\w+\/image1xxl/, "/image1xxl"); // first image has a colour url fragment, remove it
		
		for(var i=2;i<5;i++){
			var ilink = link.replace("image1", 'image'+ i );
			elems['images'].push({
				url: ilink,
				text: 'i'+i
			});
		}
		
		var videolink = document.getElementById('VideoPath').getAttribute('value');
		if( videolink.indexOf('blank') < 0 ){ // -1 is not found
			elems['images'].push({
				url: videolink,
				text: 'video'
			});
		}

		// we need a wrapper div for font size
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "font-size: 1.4em;");
		wrapper.appendChild( companion_node(elems) );

		$('#content_product_images_box').append( wrapper );
	}else{
		debug('asos non-product page');
	}
}else if( location.href.match(/\.bata/) ){	// http://www.bata.eu/  http://www.bata.com/online-shopping/
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('bata EU product');

		var tags = $("#article-image-zoom .swiper-slide");
		for(var i=0; i < tags.length; i++){
			var url = $(tags[i]).children()[0].getAttribute('data-big-img-src');

			if( url ){
				elems['images'].push({
					url: url,
					text: 'i'+(i+1)
				});
			}
		}

		$('#tabs').append( companion_node(elems) );
	}else{
		debug('bata EU page');
	}

}else if( location.href.match(/neimanmarcus\.|bergdorfgoodman\.|horchow\./) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('bergdorf/neiman/horchow product');

		var tags = $("#prod-img img");
		var urls = {}; // dedupe
		for(var i=0; i < tags.length; i++){
			var url;
			var image_url = tags[i].getAttribute('data-zoom-url');
			if( image_url ){
				url = image_url;
			}else{
				var video_url = tags[i].getAttribute('data-video-url');
				if( video_url ){
					url = location.protocol +'//'+ location.host + video_url;
				}
			}
			urls[url] = 1;
		}

		// there's a second div now, having the video 
		var tags = $(".product-thumbnails > .list-inline img");
		for(var i=0; i < tags.length; i++){
			var url;
			var image_url = tags[i].getAttribute('data-zoom-url');
			if( image_url ){
				url = image_url;
			}else{
				var video_url = tags[i].getAttribute('data-video-url');
				if( video_url ){
					url = location.protocol +'//'+ location.host + video_url;
				}
			}
			urls[url] = 1;
		}

		debug(urls);
		var i = 1;
		for(var url in urls){
			if( url.match(/\/ca\/\d/) ){
				if( url.match(/\.mp4$/) ){
					elems['images'].push({
						url: url,
						text: 'video'
					});
				}else{
					elems['images'].push({
						url: url,
						text: 'i'+i
					});
				}
				i++;
			}
		}

		if( $('#image-container .images').length > 0 ){ // neimanmarcus.com layout corner case
			$('#image-container .images').append( companion_node(elems) );
		}else{
			$('#prodPageCont table .images').append( companion_node(elems) );
		}
	}else{
		debug('bergdorf/neiman/horchow page');
	}

}else if( location.href.match(/bershka/) ){
	if( $('#fixed-controls-wrapper .prodInfo').length > 0 ){
		debug('bershka product');

		var active = window.setInterval(function(){ deferred_bershka(); }, 1500);
		debug('timer installed');
	}else{
		debug('bershka page');
	}

}else if( location.href.match(/breuninger/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('breuninger product');

		var tags = $("#podPictures img");
		for(var i=0; i < tags.length; i++){
			var url = tags[i].getAttribute('data-src-zoom');
			if( url ){
				elems['images'].push({
					url: url,
					text: 'i'+(i+1)
				});
			}
		}

		elems['disable_whh'] = 1; // xhr is misbehaving; todo
		$('#podProperties').append( companion_node(elems) );
	}else{
		debug('breuninger page');
	}

}else if( location.href.match(/buffalo-shop/) ){	// S7
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('buffalo product');

		// bug: misses thumbs amended later on via JS
		// bug: color/variant urls are not properly identified by url canonical
		var li_array = $('.productthumbnails-list').children();
		debug(li_array);
		for(var i=0; i < li_array.length; i++){
			elems['images'].push({
				url: li_array[i].children[0].children[0].getAttribute('data-zoomurl'),
				text: 'i'+ (i+1)
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "margin-left: 650px; padding-top: 10px; font-family: Helvetica, Arial, sans-serif; font-size: 1.1em;");
		wrapper.appendChild( companion_node(elems) );

		// bug: less than ideal location, with no room to grow
		$('#content').prepend( wrapper );
	}else{
		debug('buffalo page');
	}

}else if( location.href.match(/deichmann|roland-schuhe|dosenbach/) ){
	if( $('#product-detail').is("form") ){
        	// debug('deichmann product');

		var prod_shop_id = $('#checkedProductCode').attr('value');

		if( location.href.match(/roland/) ){
			prod_shop_id = prod_shop_id.replace(/^0+100/, ''); // roland ids start with 100.. after zeropadding
			debug(prod_shop_id);

			// http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--1234_PS1.jpg
			elems['images'] = [
				{ url: 'http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS.jpg', text: 'i1' },
				{ url: 'http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS1.jpg', text: 'i2' },
				{ url: 'http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS2.jpg', text: 'i3' },
			];
		}else{
			prod_shop_id = prod_shop_id.replace(/^0+/, '');
			debug(prod_shop_id);

			// alt: http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--1234_P.png
			elems['images'] = [
				{ url: 'http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P', text: 'i1' },
				{ url: 'http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P1', text: 'i2' },
				{ url: 'http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P2', text: 'i3' },
			];
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "margin-top: 5px; float: right;");
		wrapper.appendChild( companion_node(elems) );

		$('.tabContent .content-1').prepend( wrapper );
	}else{
		// debug('deichmann page');
	}

}else if( location.href.match(/goertz/) ){ // todo: unreliable
	var id = document.getElementById("zoomProductName").innerHTML;

	if( id ){
		debug('goertz product page');

		elems['images'] = [
			{ url: 'http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products', text: 'i1' },	/* tail 2 seems highest resolution */
			{ url: 'http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products1', text: 'i2' },
			{ url: 'http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products2', text: 'i3' },
			{ url: 'http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products3', text: 'i4' },
		];

	/*
		document.getElementById("productActions").innerHTML += '<br>360: ';
		for(var i=1;i<=24;i++){
			document.getElementById("productActions").innerHTML += '<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products/360/'+id+'_'+i+'.jpg">'+i+'</a> ';
		}
	*/

		$('#productSets').prepend( companion_node(elems) );
	}else{
		// debug('goertz page');
	}

}else if( location.href.match(/fashionid/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('fashionid product');

	/*	var li_array = $('.Images').children();

		for(var i = 0; i < li_array.length; i++){
			debug(li_array[i].children[0].children[0]);
		}
		
		$('li .Sizes').append( companion_node(elems) );
	*/
	}else{
		debug('fashionid non-product page');
	}

}else if( location.href.match(/hallhuber/) ){	// Magento
	if( $('#messages_product_view').length > 0 ){ // too broad
		debug('hallhuber product');

		var imagedivs = $('.product-image-gallery').children();
		for(var i=1; i < imagedivs.length; i++){ // first is same as default: skip
			var link;

		//	if( imagedivs[i].attr("data-src") ){
		//		link = imagedivs[i].attr("data-src");
		//	}else{
				link = imagedivs[i].src;
		//	}

			elems['images'].push({
				url: link,
				text: 'i'+i
			});
		}

		$('.product-collateral').append( companion_node(elems) );
	}else{
		debug('hallhuber page');
	}

}else if( location.href.match(/hm\.com/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('h&m product');

		var li_array = $('#product-thumbs').children();

		for(var i = 0; i < li_array.length; i++){
			var url = location.protocol + li_array[i].children[0].getAttribute('href').replace("product/large]","product/zoom]&sink"); // thumb, large, full, zoom
			elems['images'].push({
				url: url,
				text: 'i'+ (i+1)
			});
		}

		$('.details').append( companion_node(elems) );
	}else{
		debug('h&m page');
	}

}else if( location.href.match(/justfab/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('justfab product');

		var imagedivs = [];
		if( $('.MagicZoomPlusDisabled').length > 0 ){
			imagedivs = $('.MagicZoomPlusDisabled');
		}else{
			imagedivs = $('.MagicZoomPlus');
		}
		for(var i=0; i < imagedivs.length; i++){
			elems['images'].push({
				url: imagedivs[i].getAttribute("href"),
				text: 'i'+(i+1)
			});
		}

		if( $('#tab_video').length > 0 ){
			var link = $("#tab_video .video_type > object > embed").attr("src").split('location=');
			elems['images'].push({
				url: link[1],
				text: 'video'
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "float: left;");
		wrapper.appendChild( companion_node(elems) );

		$('#description .details').after( wrapper );
	}else{
		debug('justfab page');
	}

}else if( location.href.match(/macys/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('macys product');

		var lines = document.body.innerHTML.split(/\r?\n/);
		var main;
		var list;
		for (var i = lines.length; i--;) {
			if( lines[i].indexOf('mainImgSrc') >= 1){
				// debug("found main line"+i);
				main = lines[i];
				break;
			}else if( lines[i].indexOf('mgList: ') >= 1){
				list = lines[i];
				// debug("found list line"+i);
			}
		}
	/*
		if(main){
			main = main.split(/"/);
			// debug(main);
			elems['images'].push({
				url: 'http://slimages.macys.com/is/image/MCY/products/'+ main[1] +'?wid=1620&$filterlrg$',
				text: 'i1'
			});
		}
	*/
		if(list){
			var ids = list.match(/\/(\d+)_fpx/g);
			debug(ids);
			for(var i=0; i < ids.length; i++){
				elems['images'].push({
					url: 'http://slimages.macys.com/is/image/MCY/products/9/optimized'+ ids[i] +'.tif?wid=1620&$filterlrg$',
					text: 'i'+ (i+1)
				});
			}
		}
	}else{
		debug('macys page');
	}


	// we need a wrapper div for alignment
	var wrapper = document.createElement('div');
	wrapper.setAttribute("style", "margin-left: 350px;");
	wrapper.appendChild( companion_node(elems) );

	$('#bottomArea').prepend( wrapper );

}else if( location.href.match(/marksandspencer/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('m&s product');

		var active = window.setInterval(function(){ deferred_mands(); }, 1500);
		debug('timer installed');
	}else{
		debug('m&s page');
	}

}else if( location.href.match(/nelly|nlyman/) ){ // S7
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('nelly product page');

		var elem = meta_image.match(/nlyscandinavia\/([0-9-]+)\?/);
		var id = elem[1];

		elems['images'] = [
			{ url: 'http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_1?$productPress$', text: 'i1', style: 'font-size:13px; margin-right: 3px;' },
			{ url: 'http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_2?$productPress$', text: 'i2', style: 'font-size:13px; margin-right: 3px;' },
			{ url: 'http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_3?$productPress$', text: 'i3', style: 'font-size:13px; margin-right: 3px;' },
			{ url: 'http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_4?$productPress$', text: 'i4', style: 'font-size:13px; margin-right: 3px;' },
			{ url: 'http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_5?$productPress$', text: 'i5', style: 'font-size:13px; margin-right: 3px;' },
			{ url: 'http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_video', text: 'video-thumb', style: 'font-size:13px; margin-right: 3px;' },
			// mp4 video url seems only available via jsonp and level3 cdn; look for picsearch.com /rest ..
		];

		$('#productPage > .row-upsale').before( companion_node(elems) );
	}else{
		// debug('nelly page');
	}

}else if( location.href.match(/net-a-porter\.com/) ){
	var prodId = location.href.match(/product\/(\d+)/)[1];
	if(prodId){
		debug('nap product page');

		elems['images'] = [
			{ url: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_in_xxl.jpg', text: 'i1', style: "font-size:13px; margin-right:4px;" },
			{ url: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_ou_xxl.jpg', text: 'i2', style: "font-size:13px; margin-right:4px;" },
			{ url: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_fr_xxl.jpg', text: 'i3', style: "font-size:13px; margin-right:4px;" }, // front
			{ url: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_bk_xxl.jpg', text: 'i4', style: "font-size:13px; margin-right:4px;" }, // back
			{ url: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_cu_xxl.jpg', text: 'i5', style: "font-size:13px; margin-right:4px;" }, // closeup
			{ url: 'http://video.net-a-porter.com/videos/productPage/'+prodId+'_detail.mp4', text: 'video', style: "font-size:13px" }
		];

		$('#product-details-container').append( companion_node(elems) );
	}else{
		// debug('nap page');
	}

}else if( location.href.match(/nordstrom/) ){
	debug('nordstrom product page');

	var li_array = $('.image-thumbs').children();

	for(var i=0; i < li_array.length; i++){
		var fragment = li_array[i].children[0].getAttribute("data-img-zoom-filename"); // 'zoom' is bigger than 'gigantic'!
		elems['images'].push({
			url: "http://g.nordstromimage.com/imagegallery/store/product/"+ fragment,
			text: "i"+(i+1)
		});
	}

	// we need a wrapper div for alignment
	var wrapper = document.createElement('div');
	wrapper.setAttribute("style", "width: 450px; padding-left: 110px; font-size: 0.8em;");
	wrapper.appendChild( companion_node(elems) );

	$('#product-accordion').before( wrapper );

}else if( location.href.match(/otto/) ){	// incomplete, (only first image is on static page); also: not catching variation updates
	var meta_image = get_meta_name('og:image');
	if(meta_image){
		debug('otto product');

		var id = meta_image.match(/(\d+)\.jpg/);

		elems['images'] = [
			{ url: 'https://images.otto.de/is/image/mmo/'+ id[1] +'?scl=1', text: 'i1' },
		];

	//	var active = window.setInterval(function(){ deferred_otto(); }, 1000);
	//	debug('timer installed');

		elems['disable_whh'] = 1; // xhr is misbehaving; todo
		$('.description').append( companion_node(elems) );
	}else{
		debug('otto page');
	}

}else if( location.href.match(/sarenza/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('sarenza product page');

		var li_array = $('.slider').children();
		for(var i=0; i < li_array.length; i++){
			if($( li_array[i].children[0] ).attr('itemprop') == "image"){
				var fragment = li_array[i].children[0].getAttribute("src");

				elems['images'].push({
					url: fragment,
					text: "i"+(i+1)
				});
			}
		}

		$('.inner-aside-product').append( companion_node(elems) );
	}else{
		debug('sarenza page');
	}

}else if( location.href.match(/uniqlo/) ){
	if( $('#prodInfo').length > 0 ){ // todo: it's too broad
		debug('uniqlo product');

		var active = window.setInterval(function(){ deferred_uniqlo(); }, 1200);
		debug('timer installed');
	}else{
		debug('uniqlo page');
	}

}else if( location.href.match(/walmart/) ){
	// product filtered by url matcher
	debug('walmart product');

	// debug($('#product-media-json').contents().text());
	var images = $.parseJSON( $('#product-media-json').contents().text() );
	// debug(images);

	for(var i = 0; i < images.length; i++){
		elems['images'].push({
			url: images[i]['versions']['zoom'],
			text: 'i'+ (i+1)
		});
	}

	// we need a wrapper div for alignment
	var wrapper = document.createElement('div');
	wrapper.setAttribute("class", "col7");
	wrapper.appendChild( companion_node(elems) );

	$('.product-primary > .grid').append( wrapper );

}else if( location.href.match(/yoox/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('yoox product');

		var li_array = $('#itemThumbs').children();

		for(var i = 0; i < li_array.length; i++){
			var img = li_array[i].children[0].getAttribute("src");
			var ilink = img.replace('_9_', '_14_');

			elems['images'].push({
				url: ilink,
				text: 'i'+(i+1)
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "font-size: 1.3em;");
		wrapper.appendChild( companion_node(elems) );

		$('#itemInfoTab').append( wrapper );
	}else{
		debug('yoox page');
	}

}else if( location.href.match(/zalando/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		debug('zalando product');
		var images = $('.articleMedia_markupImage');

		for(var i=0; i < images.length; i++){
			var url = $(images[i]).attr('src');
			url = url.replace('/detail/','/large/');

			elems['images'].push({
				url: url,
				text: 'i'+(i+1)
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "position: relative; width: 250px; left: -15px;");
		wrapper.appendChild( companion_node(elems) );

		$('#productDetailsMain').append( wrapper );
	}else{
		debug('zalando non-product page');
	}

}else if( location.href.match(/zappos/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
        	debug('zappos product');
		var li_array = $('#angles-list').children();
		// debug(li_array);

		for(var i = 0; i < li_array.length; i++){
			var img = li_array[i].children[0];
			// debug(img.getAttribute("href"));

			elems['images'].push({
				url: 'http://a9.zassets.com'+ img.getAttribute("href"),
				text: 'i'+ (i+1)
			});
		}

		var video_url = $('#vertical-video').attr('href');
		if( video_url ){
			// debug(video_url);

			elems['images'].push({
				url: video_url,
				text: 'video'
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "float: right; color: #333;");
		wrapper.appendChild( companion_node(elems) );

		$('#productDescription').prepend( wrapper );
	}else{
		// debug('zappos page');
	}

}else if( location.href.match(/zara/) ){
	if( $('.cart-action') ){
		debug('zara product');

		var imagedivs = $('.bigImageContainer .image-big');

		for(var i=0; i < imagedivs.length; i++){
			var link = $( imagedivs[i] ).data("zoom-url");

			elems['images'].push({
				url: link,
				text: 'i'+(i+1)
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "font-size: 1.3em;");
		wrapper.appendChild( companion_node(elems) );

		$(".right").append( wrapper );
	}else{
		debug('zara page');
	}

}else if( location.href.match(/\/shop-companion/) ){
	$("#shop-companion").html("Good!<br>You've got the Shop Companion Add-On installed.");

	if(1){
		var settings_div = document.createElement('div');
		settings_div.setAttribute("id", "settings");
		settings_div.innerHTML = "<h3>Settings</h3><div id=\"whh-enable-div\">\"Do you...?\" feature: <a href=\"#\" id=\"whh-enable\"></a></div><div style=\"margin-top: 10px;color: #888; font-size: 0.9em;\">Um, one more thing:<br>If you want to use the \"Do you...?\" feature, you need to enable \"third-party cookies\" in your browser settings.<br>And it only works when you're logged in on evrybase.com.</div>";
		$("#shop-companion").append(settings_div);

		storage_get("whh.disabled", function(setting){
			// debug(setting);
			if(setting && setting.value == "true"){
				debug("settings: whh.disabled: true");
				$("#whh-enable").text('is OFF - click to enable');
			}else{
				debug("settings: whh.disabled: false");
				$("#whh-enable").text('is ON - click to disable');
			}
			$(document).delegate("#whh-enable", "click", function() {
				whh_enable_toggle(this);
				return false;
			});
		});
	}

} // ================ end of all else's =================

function deferred_bershka(){
	debug('deferred_bershka');
	clearInterval(active);

	var imagedivs = $(".prod-images").children();
	debug(imagedivs);
	for(var i=0; i < imagedivs.length; i++){
		var link = $(imagedivs[i]).children[0].attr('ng-src');
	debug(link);
		elems['images'].push({
			url: link,
			text: 'i'+(i+1)
		});

		if(i > 5){
			break;
		}
	}

	$('#fixed-controls-wrapper .prodInfo').append( companion_node(elems) );
}

function deferred_mands(){ // S7
	debug('deferred_mands');
	clearInterval(active);

	var li_array = $('#videoTarget #generateUniqueIdHere ul').children();
	debug(li_array);
	for(var i=0; i < li_array.length; i++){
		debug(li_array[i]);
		if( $( li_array[i] ).hasClass('zoomtext') ){
			// next
		}else if( $( li_array[i] ).hasClass('video') ){
			var url = $( li_array[i].children[0] ).attr('data-video-player').match(/"mp4" : "([^"]+)",/);

			elems['images'].push({
				url: 'http://asset1.marksandspencer.com/is/content/'+ url[1],
				text: 'video'
			});
		}else{
			var url = $( li_array[i].children[0] ).attr('src');
			if(url){
				url = url.replace('_PROD_IMAGE_IPAD$', '_MAXI_ZOOM$');
				url = url.replace('_PROD_IMAGE$', '_MAXI_ZOOM$');

				elems['images'].push({
					url: url,
					text: 'i'+ i
				});
			}
		}
	}

	// we need a wrapper div for font size
	var wrapper = document.createElement('div');
	wrapper.setAttribute("style", "font-size: 1.4em;");
	wrapper.appendChild( companion_node(elems) );

	$('#videoTarget').append( wrapper );
}

function deferred_otto(){
	debug('deferred_otto');

	clearInterval(active);
}

function deferred_uniqlo(){
	debug('deferred_uniqlo');
	clearInterval(active);

	var image = $('#prodImgDefault').find('img').attr('src').replace('.jpg', '_large.jpg');

	elems['images'] = [
		{ url: image, text: 'i1' },
	];

	var images = $('#prodThumbImgs').children();
	for(var i=0; i < images.length; i++){
		var url = $(images[i]).find('img').attr('src').replace('_mini', '');

		elems['images'].push({
			url: url,
			text: "i"+(i+2)
		});
	}


	// we need a wrapper div for alignment
	var wrapper = document.createElement('div');
	wrapper.setAttribute("style", "clear: both; float: right;");
	wrapper.appendChild( companion_node(elems) );

	$('#content').append( wrapper );
}

// ================ end of deferred functions =================

var charset = '';
if(document.characterSet){
	charset = '; charset=' + document.characterSet;
}else if(document.charset){
	charset = '; charset=' + document.charset;
}

function debug(){
	if(0){
		console.log(arguments);
	}
}

function whh_enable_toggle(test){
	storage_get('whh.disabled', function(setting){
		// debug('whh_enable_toggle:',setting);
		if(setting && setting.value == "true"){
			debug("settings: whh.disabled: toggle to false");
			storage_set('whh.disabled', "false", function(){});
			$("#whh-enable").text('is ON - click to disable');
		}else{
			debug("settings: whh.disabled: toggle to true");
			storage_set('whh.disabled', "true", function(){});
			$("#whh-enable").text('is OFF - click to enable');

		}
	});
}

function get_meta(key){
	var metas = document.getElementsByTagName('meta');

	for(i=0; i<metas.length; i++){
		if(metas[i].getAttribute("property") == key){
			return metas[i].getAttribute("content");
		}
	}

	return '';
}
function get_meta_name(key){
	var metas = document.getElementsByTagName('meta');

	for(i=0; i<metas.length; i++){
		if(metas[i].getAttribute("name") == key){
			return metas[i].getAttribute("content");
		}
	}

	return '';
}
function get_url_canonical(){
	var link_tags = document.getElementsByTagName('link');

	for(i=0; i<link_tags.length; i++){
		if(link_tags[i].getAttribute("rel") == "canonical"){
			var url = link_tags[i].getAttribute("href");
			debug("url_canonical found:", url );

			if(url.match(/^\//)){
				debug("url_canonical rel to abs");
				url = location.protocol +'//'+ location.host + url;
			}

			return url;
		}
	}

	return null;
}

function companion_node(elems){
	debug(elems);

	elems['url']		= location.href;
	elems['url_canonical']	= get_url_canonical();
	elems['title']		= document.title;
	elems['title_og']	= get_meta('og:title');

	var companion_node = document.createElement('div');
	companion_node.setAttribute("id", "ShopCompanion");
	companion_node.setAttribute("style", "margin-top: 5px; max-width: 315px; text-align: left;");
	companion_node.innerHTML =
	 '	<div style="padding: 3px 5px; border: 1px solid #ccc; border-radius: 5px 5px 0 0; border-bottom: 0; background: #fafafa; color:#468;">'
	+'		<div style="float: right; padding-right: 3px;"><a id="shopcompanion_me"></a> &nbsp; <a href="http://www.evrybase.com/shop-companion" style="text-decoration: none;">&mdash;</a></div>'
	+'		<a href="http://www.evrybase.com/" style="font-weight: bold;" title="Visit evrybase.com, ShopCompanion\'s home">Shop Companion</a>'
	+'	</div>'
	+'	<div style="border-left: 1px solid #ccc; border-right: 1px solid #ccc; min-font-size: 1em;">'
	+'	</div>'
	+'	<div style="height: 5px; border: 1px solid #ccc; border-radius: 0 0 5px 5px; border-top: 0;">'
	+'	</div>';

	if(elems['images']){
		debug('adding images');
		var div_images = document.createElement('div');
		div_images.setAttribute("style", "padding: 5px 5px 8px; border-top: 1px solid #ccc;");
		div_images.textContent = 'XL images: ';
		for(var i = 0; i < elems['images'].length; i++){
				var link = document.createElement('a');
				link.setAttribute("href", elems['images'][i]['url']);
				link.textContent = elems['images'][i]['text'];
				if(elems['images'][i]['style']){
					link.setAttribute("style", elems['images'][i]['style']);
				}else{
					link.setAttribute("style", "margin-right: 4px;");
				}
			div_images.appendChild(link);
		}
		companion_node.children[1].appendChild(div_images);
	}

	if( !elems['disable_whh'] ){
	  storage_get('whh.disabled', function(setting){
	    if(setting && setting.value != "true"){
		debug('adding whh');
		var whh = document.createElement('div');
		whh.setAttribute("style", "padding: 5px 0; border-top: 1px solid #ccc;");

		var span = document.createElement('span');
		span.setAttribute("style", "padding: 5px; width:20%;");
		span.appendChild( document.createTextNode('Do you..?  ') );
		whh.appendChild( span );

		var login_link = document.createElement('a');
		login_link.setAttribute("href", 'https://www.evrybase.com/login');
		login_link.setAttribute("id", 'shopcompanion_login');
		login_link.setAttribute("style", "padding: 5px; border-left: 1px solid #ccc; width:80%; display: none;");
		login_link.setAttribute("title", "...to bookmark products: into lists 'Heart it', 'Want it', 'Have it', 'Had it'");
		login_link.textContent = 'Please log in';
		whh.appendChild( login_link );

		var login_link_help = document.createElement('div');
		login_link_help.setAttribute("style", "padding-left: 20px; color: #555; display: none;");
		login_link_help.setAttribute("id", 'shopcompanion_login_help');
		login_link_help.innerHTML = '(<a href="http://www.evrybase.com/about" style="margin: 0;">what\'s that?</a>)';
		whh.appendChild( login_link_help );

		var heart = document.createElement('a');
		heart.setAttribute("href", '#');
		heart.setAttribute("id", 'shopcompanion_heart');
		heart.setAttribute("style", "margin: 0; padding: 5px; border-left: 1px solid #ccc; width:20%;");
		heart.textContent = 'heart it';
		whh.appendChild( heart );
		$(document).delegate("#shopcompanion_heart", "click", function() {
			debug("click: heart it");
			whh_click("heart", this );
			return false;
		});

		var want = document.createElement('a');
		want.setAttribute("href", '#');
		want.setAttribute("id", 'shopcompanion_want');
		want.setAttribute("style", "margin: 0; padding: 5px; border-left: 1px solid #ccc; width:20%;");
		want.textContent = 'want it';
		whh.appendChild( want );
		$(document).delegate("#shopcompanion_want", "click", function() {
			debug("click: want it");
			whh_click("want", this );
			return false;
		});

		var have = document.createElement('a');
		have.setAttribute("href", '#');
		have.setAttribute("id", 'shopcompanion_have');
		have.setAttribute("style", "margin: 0; padding: 5px; border-left: 1px solid #ccc; width:20%;");
		have.textContent = 'have it';
		whh.appendChild( have );
		$(document).delegate("#shopcompanion_have", "click", function() {
			debug("click: have it");
			whh_click("have", this );
			return false;
		});

		var had = document.createElement('a');
		had.setAttribute("href", '#');
		had.setAttribute("id", 'shopcompanion_had');
		had.setAttribute("style", "margin: 0; padding: 5px; border-left: 1px solid #ccc; width:20%;");
		had.textContent = 'had it';
		whh.appendChild( had );
		$(document).delegate("#shopcompanion_had", "click", function() {
			debug("click: had it");
			whh_click("had", this );
			return false;
		});

		companion_node.children[1].appendChild( whh );

		// it's a GET, so terse data
		var data_ref = { url: location.href };
		if(elems['url_canonical']){ data_ref['url_canonical'] = elems['url_canonical']; }
		if(data_ref['url'] == data_ref['url_canonical']){ delete data_ref['url']; }
		var check_data = whh_check(data_ref);
	    }
	  });
	} // end: unless disabled

	// debug(companion_node);

	return companion_node;
}

function whh_check(data_ref){
	var xhr = $.ajax({
	//	type: "GET",
		url: "//www.evrybase.com/api/me/collectibles",
		headers: { 'X-ShopCompanion': version },
		contentType: "application/json" + charset,
	//	dataType: "json",
		xhrFields: { withCredentials: true },
		data: data_ref
	});

	xhr.success(function(data) {
		if(data.error){
			debug(' whh_check done: error:', data);
			whh_disable();
		}else{
			debug(' whh_check done: ok:', data);
			for(var i = 0; i < data.me.length; i++){
				debug(' whh_check done: toggling to true:', data.me[i].namespace);
				whh_toggle( $("#shopcompanion_"+data.me[i].namespace.toLowerCase()), data.me[i] );
			}
		}
	});
	xhr.fail(function() {
		if(xhr.status == 401){
			debug(' whh_check: not authenticated');
			whh_disable('not_authenticated');
		}else{
			debug(' whh_check: fail');
			whh_disable();
		}
	});
}

function whh_disable(not_authenticated){
	if(not_authenticated){
		debug(' whh_disable: not authenticated, ask for login');
		$("#shopcompanion_heart").unbind().css("color", "#ccc").removeAttr("href").css("display", "none");
		$("#shopcompanion_want").unbind().css("color", "#ccc").removeAttr("href").css("display", "none");
		$("#shopcompanion_have").unbind().css("color", "#ccc").removeAttr("href").css("display", "none");
		$("#shopcompanion_had").unbind().css("color", "#ccc").removeAttr("href").css("display", "none");
		$("#shopcompanion_login").css("display", "inline");
		$("#shopcompanion_login_help").css("display", "inline");
	}else{
		debug(' whh_disable');
		$("#shopcompanion_heart").unbind().css("color", "#ccc").removeAttr("href");
		$("#shopcompanion_want").unbind().css("color", "#ccc").removeAttr("href");
		$("#shopcompanion_have").unbind().css("color", "#ccc").removeAttr("href");
		$("#shopcompanion_had").unbind().css("color", "#ccc").removeAttr("href");
	}
}

function whh_toggle(node, data){
	if( $(node).attr("data-collectible-id") ){
		// debug(' whh_toggle: to false', node, 'data: ', data);
		$( node ).css("background-color", "").css("border-top",0).css("border-left","1px solid #ccc").removeAttr('data-collectible-id').removeAttr('data-wild-item-id');
	}else{
		// debug(' whh_toggle: to true', node, 'data: ', data);
		$( node ).css("background-color", "#f4f4f4").css("border-top",0).css("border-left","1px solid #ccc").attr('data-collectible-id', data.id).attr('data-wild-item-id', data.wild_item_id);
	}
}

function whh_click(namespace,node){
//	$( node ).css("background-color", "#afa");
	$( node ).css("border-top", "2px solid #bbb").css("border-left", "2px solid #ccc");

	$(node).blur();

	var collectible_id = $(node).attr("data-collectible-id");
	if( collectible_id ){
		var xhr = $.ajax({
			type: "DELETE",
			url: "//www.evrybase.com/api/me/collectibles/" + collectible_id,
			headers: { 'X-ShopCompanion': version },
			contentType: "application/json"+ charset,
		//	dataType: "json",
			xhrFields: { withCredentials: true },
		//	data: { id:  }
		});
	}else{
		var xhr = $.ajax({
			type: "POST",
			url: "//www.evrybase.com/api/me/collectibles",
			headers: { 'X-ShopCompanion': version },
			contentType: "application/json"+ charset,
			dataType: "json",
			xhrFields: { withCredentials: true },
			data: JSON.stringify({ namespace: namespace, props: elems })
		});
	}

	xhr.done(function(data) {
		if(data.error){
			debug( " whh_click: done: error:", data );
			$( node ).text('error');
			whh_disable();
		}else{
			debug( " whh_click: done: ok:", data );
			whh_toggle(node, data);
		}
	});
	xhr.fail(function() {
		debug( " whh_click: fail");
		$( node ).text('error');
		whh_disable();
	});
}
