// ==UserScript==
// @name           Shop Companion
// @namespace      http://www.evrybase.com/addon
// @description    Get access to full-resolution/largest/xxl/best-size product images and videos on various shopping sites. More features coming up.
// @version        0.14
// @author         ShopCompanion
// @copyright      2014+, EVRYBASE (http://www.evrybase.com/)
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAO5AAADuQHRCeUsAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAANVQTFRFDwAA8PDw8PDw8PDw8PDw8PDw8PDw8vLy9PT09PT09PT09PT09PT09vb29vb29fX19fX19vb29vb2+Pj4+Pj4+fn5+fn5+Pj4+Pj4+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39AAAAHh4eZWVla2trbW1tcXFxhYWFjo6OlpaWm5ubqamprKyswMDAwsLCxMTEzMzMzc3N19fX4uLi/f39/v7+////B68tFQAAADF0Uk5TAAMEBQcICQkcHR4fIDg5TVFbXYiKj5KXmJiam6+xvL/AwcPGz9bX19jc3uPj5efo6eeeGU4AAADoSURBVDjLlZPnFoIwDEbjXrj3xL23uPfK+z+SoNATUNrj/Zlcekr6BYDhiRcrzcGgWSkmvPBNKD9ExqggWdq+1ARNTFM+2pdqiA/KE7FKDol01W82c8JVLXTCRj/Q1g5dzwgXrdIKfvouGXVhuzO4v0uy+y0k0RBuaCGp9f1je2HsV4Uc2guYBXD0eULfCVHkCRiDNF/IQIkvlKFOhOVK58yEBrSIwDgwoWcSForOiQh1/h0a4ksKf1M4KOGohY8lfm5hYEjkFGPUqxON3K/Q7mlo9dgfFMLRFPvP4lipSv+snnh57df/BbDVyC03lcMOAAAAAElFTkSuQmCC
// @license        GNU GPL License
// @grant          GM_addStyle
// @include        http://www.albamoda.de/*
// @include        http://www.amazon.tld/*
// @include        http://www.asos.com/*
// @include        http://www.bershka.com/*
// @include        http://www.buffalo-shop.de/*
// @include        http://buffalo-shop.de/*
// @include        http://www.deichmann.tld/*
// @include        http://www.goertz.de/*
// @include        http://www.hallhuber.com/*
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

// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js

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

var addon_name = 'Shop Companion';

if( location.href.match(/albamoda/) ){
	var meta_pagetype = get_meta_name('WT.cg_n');
	if(meta_pagetype === 'ProductDetailPage'){
	        // console.log('albamoda product');

		var li_array = $('#imgCarousel').children();
		var list = [];
		for(var i = 0; i < li_array.length; i++){
			var hash = [];
			hash['href'] = 'http://albamoda.scene7.com/is/image/AlbaModa/AlbaModa?src=mmo/'+ li_array[i].children[0].getAttribute('id') +'&scl=1';
			hash['style'] = 'margin: 0; margin-right: 5px;';
			hash['text'] = 'i'+i;
			list.push(hash);
		}

		add_html(document.getElementById("contentInfoLinks"), list);
	}
}else if( location.href.match(/amazon/) ){
	if( $('#handleBuy').is("form") ){
		console.log('amazon product page');

		var list = '';
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
				if(url){ list += '<a href="'+ url +'">i'+ i +'</a> '; }
			}
		}else{
			console.log('amazon product page json not avail');
		}

		$('.buyingDetailsGrid tr:last').after('<tr><td>'+ html_wrapper('XL images: '+ list) +'</td></tr>');
	}else if( $('#buybox') ){
		console.log('amazon html5 product page');
		if( $('.buyingDetailsGrid') ){
			console.log('amazon html5 product page with html4 buyingDetailsGrid layout');
			$('.buyingDetailsGrid tr:last').after('<tr><td>'+ html_wrapper('XL images: '+ 'this is todo') +'</td></tr>');
		}else{
			var node = $.parseHTML( html_wrapper('XL images: '+ 'this is todo') );
			$('#rightCol').append(node);
		}
	}else{
		console.log('amazon non-product page');
	}

}else if( location.href.match(/asos/) ){
    var meta_image = get_meta_name('og:image');
    if(meta_image){
       // console.log('asos product');
      	
       var list = '';
       var link = meta_image.replace("xl.jpg", "xxl.jpg");
       list += '<a href="'+ link +'">i'+ 1 +'</a> ';

       link = link.replace(/\/\w+\/image1xxl/, "/image1xxl"); // first image has a colour url fragment, remove it

       for(var i=2;i<5;i++){
           var ilink = link.replace("image1", 'image'+ i );
           list += '<a href="'+ ilink +'">i'+ i +'</a> ';
       }

	var videolink = document.getElementById('VideoPath').getAttribute('value');
	if( videolink.indexOf('blank') < 0 ){ // -1 is not found
		list += '<a href="'+ videolink +'">video</a> ';
	}

	var node = $.parseHTML( html_wrapper('XL images: '+ list) );
	$('#content_product_images_box').append(node);
    }else{
        // console.log('asos non-product page');
    }
}else if( location.href.match(/bershka/) ){
	if( $('#tallasdiv') ){
		console.log('bershka product');

		var html = '';
		var imagedivs = $("div[id^='superzoom_']").children();
		for(var i=0; i < imagedivs.length; i++){
			var link = $(imagedivs[i]).attr('rel');

			html += '<a href="'+link+'">i'+(i+1)+'</a> ';
		}

		var div = $('#detail_minis');
		div.after( $.parseHTML( '<div style="float: right; margin-right: 100px;">'+ html_wrapper('XL images: '+ html) +'</div>' ) );
	}else{
		console.log('bershka page');
	}

}else if( location.href.match(/buffalo-shop/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('buffalo product');

		var elem = meta_image.match(/buffalo\/(.+)_0\d\?/);
		var id = elem[1];

		var list = '';
		for(var i = 1; i < 8; i++){
			list += '<a href="http://buffalo.scene7.com/is/image/buffalo/'+id+'_0'+i+'?$zoom$">i'+ i +'</a> ';
		}

		$('#allVariants').css("height", "605px");
		var div = $('#allVariants .product-info-content');
		div.append( $.parseHTML( '<div style="padding-top: 10px; font-family: Helvetica, Arial, sans-serif; ">'+ html_wrapper('XL images: '+ list) +'</div>' ) );
	}else{
		console.log('buffalo page');
	}

}else if( location.href.match(/deichmann|roland-schuhe/) ){
	if( $('#product-detail').is("form") ){
        	// console.log('deichmann product');

		var prod_shop_id = $('#checkedProductCode').attr('value');

		var list = '';
		if( location.href.match(/roland/) ){
			prod_shop_id = prod_shop_id.replace(/^0+100/, ''); // roland ids start with 100.. after zeropadding
			console.log(prod_shop_id);

			// http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--1234_PS1.jpg
			list += '<a href="http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS.jpg">i1</a> ';
			list += '<a href="http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS1.jpg">i2</a> ';
			list += '<a href="http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--'+ prod_shop_id +'_PS2.jpg">i3</a> ';
		}else{
			prod_shop_id = prod_shop_id.replace(/^0+/, '');
			console.log(prod_shop_id);

			// alt: http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--1234_P.png
			list += '<a href="http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P">i1</a> ';
			list += '<a href="http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P1">i2</a> ';
			list += '<a href="http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P2">i3</a> ';
		}

		var div = $('.tabContent .content-1');
		div.prepend( $.parseHTML( '<div style="margin-top: 5px; float: right">'+ html_wrapper('XL images: '+ list) +'</div>') );
	}else{
		// console.log('deichmann page');
	}

}else if( location.href.match(/goertz/) ){
	var id = document.getElementById("zoomProductName").innerHTML;

	if( id ){
		console.log('goertz product page');

		var html = '<a href="http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products">i1</a>, '	/* ending in 2 seems highest resolution */
			+'<a href="http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products1">i2</a>, '
			+'<a href="http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products2">i3</a>, '
			+'<a href="http://i.bilder-goertz.de/is/image/goertz/original/newzoom2_40_'+id+'_000_products3">i4</a>';

	/*
		document.getElementById("productActions").innerHTML += '<br>360: ';
		for(var i=1;i<=24;i++){
			document.getElementById("productActions").innerHTML += '<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products/360/'+id+'_'+i+'.jpg">'+i+'</a> ';
		}
	*/

		var div = $('.variantActions');
		div.append( $.parseHTML( html_wrapper('XL images: '+ html) ) );
	}else{
		// console.log('goertz page');
	}

}else if( location.href.match(/hallhuber/) ){
	if( $('.messages_product_view') ){ // too broad
		console.log('hallhuber product');

		var html = '';
		var imagedivs = $('.product-image-gallery').children();
		for(var i=1; i < imagedivs.length; i++){ // first is same as default: skip
			var link;

		//	if( imagedivs[i].attr("data-src") ){
		//		link = imagedivs[i].attr("data-src");
		//	}else{
				link = imagedivs[i].src;
		//	}

			html += '<a href="'+link+'">i'+i+'</a> ';
		}

		var div = $('.product-collateral');
		div.append( $.parseHTML( html_wrapper('XL images: '+ html) ) );
	}else{
		console.log('hallhuber page');
	}

}else if( location.href.match(/nelly|nlyman/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('nelly product page');

	/*	var elem = location.href.split('/');
		elem.reverse();
		var idelem = elem[1].match(/(\d+-\d+)/)[0].split('-');
		var id = idelem[0]+'-'+zeroPad(idelem[1],4);
	*/

		var elem = meta_image.match(/nlyscandinavia\/([0-9-]+)\?/);
		var id = elem[1];
		var html = '<a style="font-size:13px;" href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_1?$productPress$">1</a> '
			+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_2?$productPress$">2</a> '
			+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_3?$productPress$">3</a> '
			+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_4?$productPress$">4</a> '
			+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_5?$productPress$">5</a> '
			+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_video">video-thumb</a> '
			// mp4 video url seems only available via jsonp and level3 cdn; look for picsearch.com /rest ..

		var div = $('.productpage-right');
		div.append( $.parseHTML( html_wrapper('XL images: '+ html) ) );
	}else{
		// console.log('nelly page');
	}

}else if( location.href.match(/net-a-porter\.com/) ){
	var prodId = location.href.match(/product\/(\d+)/)[1];
	if(prodId){
		console.log('nap product page');

		var elems = [];
		elems['images'] = [
			{ href: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_in_xxl.jpg', text: 'i1', style: "font-size:13px; margin-right:4px;" },
			{ href: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_ou_xxl.jpg', text: 'i2', style: "font-size:13px; margin-right:4px;" },
			{ href: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_fr_xxl.jpg', text: 'i3', style: "font-size:13px; margin-right:4px;" }, // front
			{ href: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_bk_xxl.jpg', text: 'i4', style: "font-size:13px; margin-right:4px;" }, // back
			{ href: 'http://cache.net-a-porter.com/images/products/'+prodId+'/'+prodId+'_cu_xxl.jpg', text: 'i5', style: "font-size:13px; margin-right:4px;" }, // closeup
			{ href: 'http://video.net-a-porter.com/videos/productPage/'+prodId+'_detail.mp4', text: 'video', style: "font-size:13px" }
		];

		$('#product-details-container').append( companion_node(elems) );
	}else{
		// console.log('nap page');
	}

}else if( location.href.match(/nordstrom/) ){
	console.log('nordstrom product page');

	var li_array = $('.image-thumbs').children();

	var elems = [];
	elems['images'] = [];
	for(var i=0; i < li_array.length; i++){
		var fragment = li_array[i].children[0].getAttribute("data-img-zoom-filename"); // 'zoom' is bigger than 'gigantic'!
		elems['images'].push({
			href: "http://g.nordstromimage.com/imagegallery/store/product/"+ fragment,
			text: "i"+(i+1)
		});
	}

	$('#share-buttons').append( companion_node(elems) );

}else if( location.href.match(/otto/) ){	// incomplete, (only first image is on static page); also: not catching variation updates
	var meta_image = get_meta_name('og:image');
	if(meta_image){
		console.log('otto product');

		var id = meta_image.match(/(\d+)\.jpg/);
		var html = '<a href="https://images.otto.de/is/image/mmo/'+ id[1] +'?scl=1">i1</a> ';

		var div = $('.description');
		div.append( $.parseHTML( html_wrapper('XL images: '+ html) ) );
	}else{
		console.log('otto page');
	}

}else if( location.href.match(/uniqlo/) ){
	if( $('#prodInfo') ){ // too broad
		console.log('uniqlo product');

		var html = '';
		var image = $('#prodImgDefault').find('a').attr('href');
		html += '<a href="'+image+'">i1</a> ';

		var div = $('#prodSelectAttribute');
		div.append( $.parseHTML( '<div style="margin: 0 5px 5px;">'+ html_wrapper('XL images: '+ html) +'</div>' ) );
	}else{
		console.log('uniqlo page');
	}
}else if( location.href.match(/yoox/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('yoox product');

		var li_array = $('#itemThumbs').children();
		var html = '';
		for(var i = 0; i < li_array.length; i++){
			var img = li_array[i].children[0].getAttribute("src");
			var ilink = img.replace('_9_', '_14_');
			html += '<a href="'+ ilink +'">i'+ (i+1) +'</a> ';
		}

		var div = $('#itemInfoTab');
		div.append( $.parseHTML( '<div style="font-size: 1.3em;">'+ html_wrapper('XL images: '+ html) +'</div>' ) );
	}else{
		console.log('yoox page');
	}

}else if( location.href.match(/zalando/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		// console.log('zalando product');
      	
		var list = '';
		var link = meta_image.replace("/detail/", "/large/");
		for(var i=1;i<8;i++){
		   var ilink = link.replace(/@\d/, '@'+ i );
		   list += '<a href="'+ ilink +'">i'+ i +'</a> ';
		}

		var div = $('#productDetailsMain');
		div.append( $.parseHTML( html_wrapper('XL images: '+ list) ) );
	}else{
		// console.log('zalando non-product page');
	}

}else if( location.href.match(/zappos/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
        	// console.log('zappos product');
		var li_array = $('#angles-list').children();
		console.log(li_array);

		var list = '';
		for(var i = 0; i < li_array.length; i++){
			var img = li_array[i].children[0];
			// console.log(img.getAttribute("href"));
			list += '<a href="http://a9.zassets.com'+ img.getAttribute("href") +'">i'+ (i+1) +'</a> ';
		}

		var video_url = $('#vertical-video').attr('href');
		if( video_url ){
			// console.log(video_url);
			list += '<a href="'+ video_url +'">video</a>';
		}

		$('#productDescription').prepend($.parseHTML( '<div style="float: right; color: #333;">'+ html_wrapper('XL images: '+ list) +'</div>' ));
	}else{
		// console.log('zappos page');
	}

}else if( location.href.match(/zara/) ){
	if( $('.cart-action') ){
		console.log('zara product');

		var html = '';
		var imagedivs = $('.bigImageContainer').children();
		for(var i=0; i < imagedivs.length; i++){
			var link = $( imagedivs[i] ).find("a").attr("href");
			if(link.indexOf('.html') >= 1){ break; }
			html += '<a href="'+link+'">i'+(i+1)+'</a> ';
		}

		var div = $(".right");
		div.append( $.parseHTML( '<div style="font-size: 1.3em;">'+  html_wrapper('XL images: '+ html) +'</div>') );
	}else{
		console.log('zara page');
	}

} // ================ end of all else's =================

function get_meta(key) {
	var metas = document.getElementsByTagName('meta');

	for (i=0; i<metas.length; i++){
		if (metas[i].getAttribute("property") == key){
			return metas[i].getAttribute("content");
		}
	}

	return '';
}
function get_meta_name(key) {
	var metas = document.getElementsByTagName('meta');

	for (i=0; i<metas.length; i++){
		if (metas[i].getAttribute("name") == key){
			return metas[i].getAttribute("content");
		}
	}

	return '';
} 

/*
function zeroPad(num,count){
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}
*/

function companion_node(elems){
	console.log(elems);
	var companion_node = document.createElement('div');
	companion_node.setAttribute("style", "margin-top: 5px; max-width: 300px; text-align: left;");
	companion_node.innerHTML =
	 '	<div style="padding: 3px 5px; border: 1px solid #ccc; border-radius: 5px 5px 0 0; background: #fafafa; color:#468; font-weight: bold;">'
	+ addon_name
	+'	</div>'
	+'	<div style="padding: 5px; border: 1px solid #ccc; border-radius: 0 0 5px 5px; border-top: 0; min-font-size: 1em;">'
//	+'		<p>Do you...? <a href="#want_it">want it</a> <a href="#have_it">have it</a> <a href="#had_it">had it</a></p>'
	+'	</div>';

	if(elems['images']){
		console.log(' has images');
		console.log( companion_node.children[1] );
		companion_node.children[1].textContent = 'XL images: ';
		for(var i = 0; i < elems['images'].length; i++){
				var link = document.createElement('a');
				link.setAttribute("href", elems['images'][i]['href']);
				link.textContent = elems['images'][i]['text'];
				if(elems['images'][i]['style']){
					link.setAttribute("style", elems['images'][i]['style']);
				}else{
					link.setAttribute("style", "margin-right: 4px;");
				}
			companion_node.children[1].appendChild(link);
			
		}
		console.log(companion_node);
	}

	return companion_node;
}


// experimental low level DOM constructor, only one site/code uses this
function add_html(parent,children) {
	console.log(parent);
	console.log(children);

	var containerdiv = document.createElement('div');
	containerdiv.setAttribute("id", "shop-companion");
	containerdiv.setAttribute("style", "margin-top: 5px; max-width: 300px; text-align: left;");

		var headerdiv = document.createElement('div');
		headerdiv.setAttribute("style", "padding: 3px 5px; border: 1px solid #ccc; border-radius: 5px 5px 0 0; background: #fafafa; color:#468; font-weight: bold;");
		var headertext = document.createTextNode(addon_name);
		headerdiv.appendChild(headertext);
	containerdiv.appendChild(headerdiv);

		var contentdiv = document.createElement('div');
		contentdiv.setAttribute("style", "padding: 5px; border: 1px solid #ccc; border-radius: 0 0 5px 5px; border-top: 0; min-font-size: 1em;");
	containerdiv.appendChild(contentdiv);

		var imagestext = document.createTextNode('XL images: ');
		contentdiv.appendChild(imagestext);

		for(var i = 0; i < children.length; i++){
			var link = document.createElement('a');
			link.setAttribute("href", children[i]['href']);
			if(children[i]['style']){ link.setAttribute("style", children[i]['style']); }

				var linktext = document.createTextNode(children[i]['text']);
			link.appendChild(linktext);

			contentdiv.appendChild(link);
		}

	parent.appendChild(containerdiv);
}

// legacy HTML combiner, return value is being parsed to a node later
function html_wrapper(html_to_add){
    return '<div id="shop-companion" style=" margin-top: 5px; max-width: 300px; text-align: left;">'
	+'	<div style="padding: 3px 5px; border: 1px solid #ccc; border-radius: 5px 5px 0 0; background: #fafafa; color:#468; font-weight: bold;">'
	+ addon_name
	+'	</div>'
	+'	<div style="padding: 5px; border: 1px solid #ccc; border-radius: 0 0 5px 5px; border-top: 0; min-font-size: 1em;">'
	+ html_to_add
//	+'		<p>Do you...? <a href="#want_it">want it</a> <a href="#have_it">own it</a> <a href="#had_it">had it</a></p>'
	+'	</div>'
	+'</div>';
}
