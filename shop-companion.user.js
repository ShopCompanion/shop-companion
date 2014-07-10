// ==UserScript==
// @name           Shop Companion
// @namespace      http://www.evrybase.com/addon
// @description    Get access to full-resolution/largest/xxl/best-size product images and videos on various shopping sites. More features coming up.
// @version        0.19
var version =      0.19;
// @author         ShopCompanion
// @homepage       http://www.evrybase.com/
// @copyright      2014+, EVRYBASE (http://www.evrybase.com/)
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAO5AAADuQHRCeUsAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAANVQTFRFDwAA8PDw8PDw8PDw8PDw8PDw8PDw8vLy9PT09PT09PT09PT09PT09vb29vb29fX19fX19vb29vb2+Pj4+Pj4+fn5+fn5+Pj4+Pj4+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39AAAAHh4eZWVla2trbW1tcXFxhYWFjo6OlpaWm5ubqamprKyswMDAwsLCxMTEzMzMzc3N19fX4uLi/f39/v7+////B68tFQAAADF0Uk5TAAMEBQcICQkcHR4fIDg5TVFbXYiKj5KXmJiam6+xvL/AwcPGz9bX19jc3uPj5efo6eeeGU4AAADoSURBVDjLlZPnFoIwDEbjXrj3xL23uPfK+z+SoNATUNrj/Zlcekr6BYDhiRcrzcGgWSkmvPBNKD9ExqggWdq+1ARNTFM+2pdqiA/KE7FKDol01W82c8JVLXTCRj/Q1g5dzwgXrdIKfvouGXVhuzO4v0uy+y0k0RBuaCGp9f1je2HsV4Uc2guYBXD0eULfCVHkCRiDNF/IQIkvlKFOhOVK58yEBrSIwDgwoWcSForOiQh1/h0a4ksKf1M4KOGohY8lfm5hYEjkFGPUqxON3K/Q7mlo9dgfFMLRFPvP4lipSv+snnh57df/BbDVyC03lcMOAAAAAElFTkSuQmCC
// @license        GNU GPL License
// @grant          GM_addStyle
// @include        http://*.albamoda.tld/*
// @include        http://www.amazon.tld/*
// @include        http://www.asos.com/*
// @include        http://www.bershka.com/*
// @include        http://www.buffalo-shop.de/*
// @include        http://buffalo-shop.de/*
// @include        http://www.deichmann.tld/*
// @include        http://www.goertz.de/*
// @include        http://www.hallhuber.com/*
// @include        http://www.justfab.tld/*
// @include        http://www.nelly.tld/*
// @include        http://nelly.tld/*
// @include        http://nlyman.tld/*
// @include        http://www.net-a-porter.com/*
// @include        http://shop.nordstrom.com/s/*
// @include        http://www.otto.de/*
// @include       https://www.otto.de/*
// @include        http://www.roland-schuhe.de/*
// @include        http://www.uniqlo.tld/*
// @include        http://www.yoox.com/*
// @include        http://www.zalando.de/*
// @include        http://www.zappos.com/*
// @include        http://www.zara.com/*

// @include        http://www.evrybase.com/shop-companion

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

var elems	= {}; // Object! for assoc. arrays
elems['images'] = [];

if( location.href.match(/albamoda/) ){
	var meta_pagetype = get_meta_name('WT.cg_n');
	if(meta_pagetype === 'ProductDetailPage'){
	        console.log('albamoda product');

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
		console.log('albamoda non-product page');
	}

}else if( location.href.match(/amazon/) ){
	if( $('#handleBuy').is("form") ){
		console.log('amazon product page');

		var items = document.getElementsByTagName("script");
		var json;
		if(items.length){
			for (var i = items.length; i--;) {
				if( items[i].innerHTML.indexOf('var colorImages = ') >= 1){
					console.log('found: ' + items[i]);
					var lines = items[i].innerHTML.split(/\r?\n/);
					json = lines[2].match(/colorImages\s=\s([^;]+);/)
					// console.log(json[1]);
					break;
				}
			}
		}else{
			console.log('amazon image list not avail');
		}

		if(json[1]){
			var jsonObj = $.parseJSON(json[1]);
			var array = jsonObj.initial;
			// console.log(array);
			for(var i = 0; i < array.length; i++){
				var url;
				if(array[i]['hiRes']){
					// console.log(array[i]['hiRes']);
					url = array[i]['hiRes'];
					// replacing SL1500 with something large or undef (simply SL), same as SCRMZZZZZZ
					url = url.replace("SL1500", "SL");
				}else if(array[i]['large']){
					// console.log(array[i]['large']);
					url = array[i]['large'];
				}
				if(url){
					elems['images'].push({
						url: url,
						text: 'i'+i
					});
				}
			}
		}else{
			console.log('amazon product page json not avail');
		}

		$('.buyingDetailsGrid tr:last').after('<tr><td>'+ companion_node(elems).innerHTML +'</td></tr>');
	}else if( $('#buybox').length > 0 ){
		console.log('amazon html5 product page');
		if( $('.buyingDetailsGrid').length > 0 ){
			console.log('amazon html5 product page with html4 buyingDetailsGrid layout');
		//	$('.buyingDetailsGrid tr:last').after('<tr><td>'+ html_wrapper('XL images: '+ 'this is todo') +'</td></tr>');
		}else{
		//	var node = $.parseHTML( html_wrapper('XL images: '+ 'this is todo') );
		//	$('#rightCol').append(node);
		}
	}else{
		console.log('amazon non-product page');
	}

}else if( location.href.match(/asos/) ){
	var meta_image = get_meta_name('og:image');
	if(meta_image){
		console.log('asos product');

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
		
		$('#content_product_images_box').append( companion_node(elems) );
	}else{
		console.log('asos non-product page');
	}
}else if( location.href.match(/bershka/) ){
	if( $('#tallasdiv').length > 0 ){
		console.log('bershka product');

		var imagedivs = $("div[id^='superzoom_']").children();
		for(var i=0; i < imagedivs.length; i++){
			var link = $(imagedivs[i]).attr('rel');

			elems['images'].push({
				url: link,
				text: 'i'+(i+1)
			});
		}

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "float: right; margin-right: 100px;");
		wrapper.appendChild( companion_node(elems) );

		$('#detail_minis').after( wrapper );
	}else{
		console.log('bershka page');
	}

}else if( location.href.match(/buffalo-shop/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('buffalo product');

		// bug: misses thumbs amended later on via JS
		var li_array = $('.productthumbnails-list').children();
		for(var i=0; i < li_array.length; i++){
			elems['images'].push({
				url: li_array[i].children[0].getAttribute('data-zoomurl'),
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
		console.log('buffalo page');
	}

}else if( location.href.match(/deichmann|roland-schuhe/) ){
	if( $('#product-detail').is("form") ){
        	// console.log('deichmann product');

		var prod_shop_id = $('#checkedProductCode').attr('value');

		if( location.href.match(/roland/) ){
			prod_shop_id = prod_shop_id.replace(/^0+100/, ''); // roland ids start with 100.. after zeropadding
			console.log(prod_shop_id);

			// http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--1234_PS1.jpg
			elems['images'] = [
				{ url: 'http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS.jpg', text: 'i1' },
				{ url: 'http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS1.jpg', text: 'i2' },
				{ url: 'http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS2.jpg', text: 'i3' },
			];
		}else{
			prod_shop_id = prod_shop_id.replace(/^0+/, '');
			console.log(prod_shop_id);

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
		// console.log('deichmann page');
	}

}else if( location.href.match(/goertz/) ){
	var id = document.getElementById("zoomProductName").innerHTML;

	if( id ){
		console.log('goertz product page');

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
		// console.log('goertz page');
	}

}else if( location.href.match(/hallhuber/) ){
	if( $('.messages_product_view').length > 0 ){ // too broad
		console.log('hallhuber product');

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
		console.log('hallhuber page');
	}

}else if( location.href.match(/justfab/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('justfab product');

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
		console.log('justfab page');
	}

}else if( location.href.match(/nelly|nlyman/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('nelly product page');

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

		$('.productpage-right').append( companion_node(elems) );
	}else{
		// console.log('nelly page');
	}

}else if( location.href.match(/net-a-porter\.com/) ){
	var prodId = location.href.match(/product\/(\d+)/)[1];
	if(prodId){
		console.log('nap product page');

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
		// console.log('nap page');
	}

}else if( location.href.match(/nordstrom/) ){
	console.log('nordstrom product page');

	var li_array = $('.image-thumbs').children();

	for(var i=0; i < li_array.length; i++){
		var fragment = li_array[i].children[0].getAttribute("data-img-zoom-filename"); // 'zoom' is bigger than 'gigantic'!
		elems['images'].push({
			url: "http://g.nordstromimage.com/imagegallery/store/product/"+ fragment,
			text: "i"+(i+1)
		});
	}

	$('#share-buttons').append( companion_node(elems) );

}else if( location.href.match(/otto/) ){	// incomplete, (only first image is on static page); also: not catching variation updates
	var meta_image = get_meta_name('og:image');
	if(meta_image){
		console.log('otto product');

		var id = meta_image.match(/(\d+)\.jpg/);

		elems['images'] = [
			{ url: 'https://images.otto.de/is/image/mmo/'+ id[1] +'?scl=1', text: 'i1' },
		];

		$('.description').append( companion_node(elems) );
	}else{
		console.log('otto page');
	}

}else if( location.href.match(/uniqlo/) ){
	if( $('#prodInfo').length > 0 ){ // todo: it's too broad
		console.log('uniqlo product');

		var image = $('#prodImgDefault').find('a').attr('href');

		elems['images'] = [
			{ url: image, text: 'i1' },
		];

		// we need a wrapper div for alignment
		var wrapper = document.createElement('div');
		wrapper.setAttribute("style", "margin: 0 5px 5px;");
		wrapper.appendChild( companion_node(elems) );

		$('#prodSelectAttribute').append( wrapper );
	}else{
		console.log('uniqlo page');
	}
}else if( location.href.match(/yoox/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('yoox product');

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
		console.log('yoox page');
	}

}else if( location.href.match(/zalando/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('zalando product');
      	
		var link = meta_image.replace("/detail/", "/large/");
		for(var i=1;i<8;i++){
			var ilink = link.replace(/@\d/, '@'+ i );

			elems['images'].push({
				url: ilink,
				text: 'i'+i
			});
		}

		$('#productDetailsMain').append( companion_node(elems) );
	}else{
		console.log('zalando non-product page');
	}

}else if( location.href.match(/zappos/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
        	console.log('zappos product');
		var li_array = $('#angles-list').children();
		// console.log(li_array);

		for(var i = 0; i < li_array.length; i++){
			var img = li_array[i].children[0];
			// console.log(img.getAttribute("href"));

			elems['images'].push({
				url: 'http://a9.zassets.com'+ img.getAttribute("href"),
				text: 'i'+ (i+1)
			});
		}

		var video_url = $('#vertical-video').attr('href');
		if( video_url ){
			// console.log(video_url);

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
		// console.log('zappos page');
	}

}else if( location.href.match(/zara/) ){
	if( $('.cart-action') ){
		console.log('zara product');

		var imagedivs = $('.bigImageContainer').children();
		for(var i=0; i < imagedivs.length; i++){
			var link = $( imagedivs[i] ).find("a").attr("href");
			if(link.indexOf('.html') >= 1){ break; }

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
		console.log('zara page');
	}

}else if( location.href.match(/\/shop-companion/) ){
	$("#shop-companion").html("Good!<br><br>You've got the Shop Companion Add-On installed.<br><br>Um, one more thing:<br>If you want to use the \"Do you...?\" feature, you need to enable \"third-party cookies\" in your browser settings.<br>And it only works when you're logged in on evrybase.com.");
	$("#shop-companion").append( companion_node(elems) );

} // ================ end of all else's =================

function get_meta(key) {
	var metas = document.getElementsByTagName('meta');

	for(i=0; i<metas.length; i++){
		if(metas[i].getAttribute("property") == key){
			return metas[i].getAttribute("content");
		}
	}

	return '';
}
function get_meta_name(key) {
	var metas = document.getElementsByTagName('meta');

	for(i=0; i<metas.length; i++){
		if(metas[i].getAttribute("name") == key){
			return metas[i].getAttribute("content");
		}
	}

	return '';
}
function get_url_canonical() {
	var link_tags = document.getElementsByTagName('link');

	for(i=0; i<link_tags.length; i++){
		if(link_tags[i].getAttribute("rel") == "canonical"){
			var url = link_tags[i].getAttribute("href");
			console.log("url_canonical found:", url );

			if(url.match(/^\//)){
				console.log("url_canonical rel to abs");
				url = location.protocol +'//'+ location.host + url;
			}

			return url;
		}
	}

	return null;
}

function companion_node(elems){
	console.log(elems);

	elems['url']		= location.href;
	elems['url_canonical']	= get_url_canonical();
	elems['title']		= document.title;

	var companion_node = document.createElement('div');
	companion_node.setAttribute("style", "margin-top: 5px; max-width: 315px; text-align: left;");
	companion_node.innerHTML =
	 '	<div style="padding: 3px 5px; border: 1px solid #ccc; border-radius: 5px 5px 0 0; border-bottom: 0; background: #fafafa; color:#468;">'
	+'		<div style="float: right;padding-right: 3px;"><a href="http://www.evrybase.com/shop-companion">&mdash;</a></div>'
	+'		<span style="font-weight: bold;">Shop Companion</span>'
	+'	</div>'
	+'	<div style="border-left: 1px solid #ccc; border-right: 1px solid #ccc; min-font-size: 1em;">'
	+'	</div>'
	+'	<div style="height: 5px; border: 1px solid #ccc; border-radius: 0 0 5px 5px; border-top: 0;">'
	+'	</div>';

	if(elems['images']){
		console.log('adding images');
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

	if(0){
		console.log('adding whh');
		var whh = document.createElement('div');
		whh.setAttribute("style", "padding: 5px 0; border-top: 1px solid #ccc;");
		var span = document.createElement('span');
		span.setAttribute("style", "padding: 5px; width:20%;");
		span.appendChild( document.createTextNode('Do you..?  ') );
		whh.appendChild( span );

		var heart = document.createElement('a');
		heart.setAttribute("href", '#');
		heart.setAttribute("id", 'shopcompanion_heart');
		heart.setAttribute("style", "padding: 5px; border-left: 1px solid #ccc; width:20%;");
		heart.textContent = 'heart it';
		whh.appendChild( heart );
		$(document).delegate("#shopcompanion_heart", "click", function() {
			console.log("click: heart it");
			whh_click("heart", this );
			return false;
		});

		var want = document.createElement('a');
		want.setAttribute("href", '#');
		want.setAttribute("id", 'shopcompanion_want');
		want.setAttribute("style", "padding: 5px; border-left: 1px solid #ccc; width:20%;");
		want.textContent = 'want it';
		whh.appendChild( want );
		$(document).delegate("#shopcompanion_want", "click", function() {
			console.log("click: want it");
			whh_click("want", this );
			return false;
		});

		var have = document.createElement('a');
		have.setAttribute("href", '#');
		have.setAttribute("id", 'shopcompanion_have');
		have.setAttribute("style", "padding: 5px; border-left: 1px solid #ccc; width:20%;");
		have.textContent = 'have it';
		whh.appendChild( have );
		$(document).delegate("#shopcompanion_have", "click", function() {
			console.log("click: have it");
			whh_click("have", this );
			return false;
		});

		var had = document.createElement('a');
		had.setAttribute("href", '#');
		had.setAttribute("id", 'shopcompanion_had');
		had.setAttribute("style", "padding: 5px; border-left: 1px solid #ccc; width:20%;");
		had.textContent = 'had it';
		whh.appendChild( had );
		$(document).delegate("#shopcompanion_had", "click", function() {
			console.log("click: had it");
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

	// console.log(companion_node);

	return companion_node;
}

function whh_check(data_ref){
	var xhr = $.ajax({
	//	type: "GET",
		url: "http://localhost:3000/api/user/collectible",
		headers: { 'X-ShopCompanion': version },
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		xhrFields: { withCredentials: true },
		data: data_ref
	});

	xhr.success(function(data) {
		if(data.error){
			console.log(' whh_check done: error:', data);
			whh_disable();
		}else{
			console.log(' whh_check done: ok:', data);
			for(var i = 0; i < data.length; i++){
				console.log(' whh_check done: selecting:', data[i].namespace);
				whh_select( $("#shopcompanion_"+data[i].namespace.toLowerCase()) );
			}
		}
	});
	xhr.fail(function() {
		console.log(' whh_check fail');
		whh_disable();
	});
}

function whh_disable(){
	console.log(' whh_disable');
	$("#shopcompanion_heart").unbind().css("color", "#ccc").removeAttr("href");
	$("#shopcompanion_want").unbind().css("color", "#ccc").removeAttr("href");
	$("#shopcompanion_have").unbind().css("color", "#ccc").removeAttr("href");
	$("#shopcompanion_had").unbind().css("color", "#ccc").removeAttr("href");
}

function whh_select(node){
//	console.log(' whh_select:', node);
	$( node ).css("background-color", "#f5f5f5").css("border-top",0).css("border-left","1px solid #ccc").removeAttr("href");
}

function whh_click(namespace,node){
//	$( node ).css("background-color", "#afa");
	$( node ).css("border-top", "2px solid #bbb").css("border-left", "2px solid #ccc");

	$(node).blur();

	var xhr = $.ajax({
		type: "POST",
		url: "http://localhost:3000/api/user/collectible",
		headers: { 'X-ShopCompanion': version },
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		xhrFields: { withCredentials: true },
		data: JSON.stringify({ namespace: namespace, props: elems })
	});

	xhr.done(function(data) {
		if(data.error){
			console.log( " whh_click: done: error:", data );
			$( node ).text('error');
		}else{
			console.log( " whh_click: done: ok:", data );
			whh_select(node);
		}
	});
	xhr.fail(function() {
		console.log( " whh_click: fail");
		$( node ).text('error');
		whh_disable();
	});
}
