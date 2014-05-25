// ==UserScript==
// @name           Shop Companion
// @namespace      http://www.evrybase.com/addon
// @description    Get access to largest/xxl/best-size product images and videos on various shopping sites. More features coming up.
// @version        0.8
// @author         ShopCompanion
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAO5AAADuQHRCeUsAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAANVQTFRFDwAA8PDw8PDw8PDw8PDw8PDw8PDw8vLy9PT09PT09PT09PT09PT09vb29vb29fX19fX19vb29vb2+Pj4+Pj4+fn5+fn5+Pj4+Pj4+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39AAAAHh4eZWVla2trbW1tcXFxhYWFjo6OlpaWm5ubqamprKyswMDAwsLCxMTEzMzMzc3N19fX4uLi/f39/v7+////B68tFQAAADF0Uk5TAAMEBQcICQkcHR4fIDg5TVFbXYiKj5KXmJiam6+xvL/AwcPGz9bX19jc3uPj5efo6eeeGU4AAADoSURBVDjLlZPnFoIwDEbjXrj3xL23uPfK+z+SoNATUNrj/Zlcekr6BYDhiRcrzcGgWSkmvPBNKD9ExqggWdq+1ARNTFM+2pdqiA/KE7FKDol01W82c8JVLXTCRj/Q1g5dzwgXrdIKfvouGXVhuzO4v0uy+y0k0RBuaCGp9f1je2HsV4Uc2guYBXD0eULfCVHkCRiDNF/IQIkvlKFOhOVK58yEBrSIwDgwoWcSForOiQh1/h0a4ksKf1M4KOGohY8lfm5hYEjkFGPUqxON3K/Q7mlo9dgfFMLRFPvP4lipSv+snnh57df/BbDVyC03lcMOAAAAAElFTkSuQmCC
// @license        GNU GPL License
// @grant          GM_addStyle
// @updateURL      https://greasyfork.org/scripts/1678-shop-companion/code/Shop%20Companion.user.js
// @include        http://www.albamoda.de/*
// @include        http://www.amazon.tld/*
// @include        http://www.asos.com/*
// @include        http://www.buffalo-shop.de/*
// @include        http://www.deichmann.tld/*
// @include        http://www.goertz.de/*
// @include        http://www.nelly.tld/*
// @include        http://www.net-a-porter.com/*
// @include        http://www.roland-schuhe.de/*
// @include        http://www.zalando.de/*
// @include        http://www.zappos.com/*

// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js

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

        var div = document.getElementById('content_product_images_box');
         div.innerHTML += html_wrapper('XL images: '+ list);
    }else{
        // console.log('asos non-product page');
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
					lines = items[i].innerHTML.split(/\r?\n/);
					json = lines[2].match(/colorImages\s=\s([^;]+);/)
					console.log(json[1]);
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
			document.getElementById("rightCol").innerHTML += html_wrapper('XL images: '+ 'this is todo');
		}
	}else{
		console.log('amazon non-product page');
	}

}else if( location.href.match(/deichmann/) ){
	if( $('#product-detail').is("form") ){
        	// console.log('deichmann product');

		var prod_shop_id = $('#checkedProductCode').attr('value');
		prod_shop_id = prod_shop_id.replace(/^0+/, '');
		console.log(prod_shop_id);

		var list = '';
	//	list += '<a href="http://deichmann.scene7.com/asset/deichmann/t_product/p_100/--1214202_P.png">i'+ (i+1) +'</a> ';
		list += '<a href="http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P">i1</a> ';
		list += '<a href="http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P1">i2</a> ';
		list += '<a href="http://deichmann.scene7.com/is/image/deichmann/'+ prod_shop_id +'_P2">i3</a> ';

		var div = $('.tabContent .content-1');
		div.prepend('<div style="margin-top: 5px; float: right">'+ html_wrapper('XL images: '+ list) +'</div>');
	}else{
		// console.log('deichmann page');
	}

}else if( location.href.match(/goertz\.de/) ){
	var id = document.getElementById("zoomProductName").innerHTML;
	document.getElementById("go_to_seteditor").parentNode.parentNode.innerHTML += '<div style="border: 1px solid #000; padding: 5px;"><b style="color:#000;">Shop Companion:</b><br>'
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1346053222296/products/new_zoom2/'+id+'.jpg">zoom1</a>, '	/* ending in _3 means highest resolution*/
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1346053222296/products1/new_zoom2/'+id+'.jpg">zoom2</a>, '
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1346053222296/products2/new_zoom2/'+id+'.jpg">zoom3</a>, '
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1346053222296/products3/new_zoom2/'+id+'.jpg">zoom4</a>';
	document.getElementById("productActions").innerHTML += '<br>360: ';
	for(var i=1;i<=24;i++){
		document.getElementById("productActions").innerHTML += '<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products/360/'+id+'_'+i+'.jpg">'+i+'</a> ';
	}

}else if( location.href.match(/nelly/) ){
	// http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/475197-0001_3?layer=comp&bgc=0xe7e7e7&&op_sharpen=0&qlt=72,1&resMode=sharp2&op_usm=0.9,0.8,1,0&iccEmbed=0&req=tmb&wid=1400&hei=1800&fmt=swf
	// http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/475197-0001_3?layer=comp&bgc=0x000000&&op_sharpen=0&qlt=72,1&resMode=sharp2&op_usm=0.9,0.8,1,0&iccEmbed=0&req=tmb&wid=1500&hei=1800&fmt=png
	// http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/475197-0001_4?bgc=0x000000&wid=1500&hei=1900&fmt=png
	// http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/475197-0001_3?bgc=0x000000&&resMode=sharp2&wid=1500&fmt=png
	// http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/475197-0001_1?$productPress$
	var elem = location.href.split('/');
	elem.reverse();
	var idelem = elem[1].match(/(\d+-\d+)/)[0].split('-');
	var id = idelem[0]+'-'+zeroPad(idelem[1],4);
/*	document.getElementById("productInfo_main_container_item_info_price").innerHTML += '<strong><b style="color:#000;">Shop Companion:</b><br>' */
	document.getElementById("count").parentNode.innerHTML += '<strong><b style="color:#000;">Shop Companion:</b><br>'
		+'<a style="font-size:13px;" href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_1?$productPress$">1</a> '
		+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_2?$productPress$">2</a> '
		+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_3?$productPress$">3</a> '
		+'<a style="font-size:13px;"  href="http://nlyscandinavia.scene7.com/is/image/nlyscandinavia/'+id+'_4?$productPress$">4</a> '
		+'<a style="font-size:13px;"  href="http://video.nelly.com/'+id+'.flv">flv</a></strong>';

}else if( location.href.match(/net-a-porter\.com/) ){
	var prodId = location.href.match(/product\/(\d+)/)[1];
	// http://cache.net-a-porter.com/images/products/97103/97103_in_xs.jpg
	document.getElementById("button-holder").innerHTML += '<br><b style="color:#000;">Shop Companion:</b><br>'
		+'<a style="font-size:13px;" href="http://cache.net-a-porter.com/images/products/97103/97103_in_xs.jpg">1</a> ';

}else if( location.href.match(/roland-schuhe\.de/) ){
	// <link rel="image_src" href="http://www.roland-schuhe.de/produktbilder/teaser/1025606_P1.jpg" / >
	// http://www.roland-schuhe.de/produktbilder/zoom/1020392_P1.jpg
	var h = document.getElementsByTagName("link");

	for(var i=0;i<h.length;i++){
		if(h[i].href.match(/produktbilder/)){
			var zoom = h[i].href;
			zoom1 = zoom.replace(/teaser\//,"zoom/");
			var zoom2 = zoom1;
			zoom2 = zoom2.replace(/_P1/,"_P2");
			var zoom3 = zoom1;
			zoom3 = zoom3.replace(/_P1/,"_P3");
			document.getElementById("artikel_text").innerHTML += '<br><strong><b style="color:#000;">Shop Companion:</b> '
				+'<a href="'+zoom1+'">1</a> '
				+'<a href="'+zoom2+'">2</a> '
				+'<a href="'+zoom3+'">3</a> </strong>';
		}
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

        var div = document.getElementById('productDetailsMain');
         div.innerHTML += html_wrapper('XL images: '+ list);
        // document.title = '123';
    }else{
        // console.log('zalando non-product page');
    }
}else if( location.href.match(/goertz\.de/) ){
	var id = document.getElementById("zoomProductName").innerHTML;
	document.getElementById("productActions").innerHTML += '<br><b style="color:#000;">Shop Companion:</b><br>'
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products/zoom/'+id+'_3.jpg">zoom1</a>, '	/* ending in _3 means highest resolution*/
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products1/zoom/'+id+'_3.jpg">zoom2</a>, '
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products2/zoom/'+id+'_3.jpg">zoom3</a>, '
		+'<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products3/zoom/'+id+'_3.jpg">zoom4</a>';
	document.getElementById("productActions").innerHTML += '<br>360: ';
	for(var i=1;i<=24;i++){
		document.getElementById("productActions").innerHTML += '<a href="http://demandware.edgesuite.net/aack_prd/on/demandware.static/Sites-Goertz-Site/Sites-goertz-DE-Catalog/de_DE/v1281686171187/products/360/'+id+'_'+i+'.jpg">'+i+'</a> ';
	}

}else if( location.href.match(/buffalo-shop/) ){
	var meta_image = get_meta('og:image');
	if(meta_image){
		console.log('buffalo product');

		var div = $('.product-info-content');
		div.innerHTML += '<div style="">'+ html_wrapper('XL images: '+ 123) +'</div>';
/*
		document.getElementById('detailBereichLinks').innerHTML += '<b>Shop Companion</b>';
	
		var strMatrix = document.getElementById('produktMatrix').value;
		var arrMatrix = strMatrix.split('\n');
		for(var key in arrMatrix){
			if(arrMatrix[key].split('=')[0] == 'DstData55'){
				document.getElementById('detailBereichLinks').innerHTML += '<br>Lager: '+ arrMatrix[key].split('=')[1];
			}
		}
	
		var prepro = document.getElementById('BasketLayerThumb').children[0].src.match(/\/(\d+)\.jpg/);
		var product = prepro[1];
	
		document.getElementById('detailBereichLinks').innerHTML += '<br><a href="/Shop/PicProductFront/'+product+'.jpg">Front</a>, '
			+'<a href="/Shop/PicProductBack/'+product+'.jpg">Back</a>, '
			+'<a href="/Shop/PicProductDetail/'+product+'.jpg">Detail</a>, '
			+'<a href="/Shop/PicProductSole/'+product+'.jpg">Sole</a>, '
			+'<a href="/Shop/PicZoomProductBig/'+product+'.jpg">Zoombild Front</a>, '
			+'<a href="/Shop/PicZoomBackBig/'+product+'.jpg">Zoombild Back</a>'
			+'<br><a href="/Shop/PicZoom3D/00/'+product+'.jpg">3D-00</a>, '
			+'<a href="/Shop/PicZoom3D/01/'+product+'.jpg">3D-01</a>, '
			+'<a href="/Shop/PicZoom3D/02/'+product+'.jpg">3D-02</a>, '
			+'<a href="/Shop/PicZoom3D/03/'+product+'.jpg">3D-03</a>, '
			+'<a href="/Shop/PicZoom3D/04/'+product+'.jpg">3D-04</a>, '
			+'<a href="/Shop/PicZoom3D/05/'+product+'.jpg">3D-05</a>'
			+'<br><a href="/Shop/PicZoom3D/06/'+product+'.jpg">3D-06</a>, '
			+'<a href="/Shop/PicZoom3D/07/'+product+'.jpg">3D-07</a>, '
			+'<a href="/Shop/PicZoom3D/08/'+product+'.jpg">3D-08</a>, '
			+'<a href="/Shop/PicZoom3D/09/'+product+'.jpg">3D-09</a>, '
			+'<a href="/Shop/PicZoom3D/10/'+product+'.jpg">3D-10</a>, '
			+'<a href="/Shop/PicZoom3D/11/'+product+'.jpg">3D-11</a>'
			+'<br><a href="/Shop/PicZoom3D/12/'+product+'.jpg">3D-12</a>, '
			+'<a href="/Shop/PicZoom3D/13/'+product+'.jpg">3D-13</a>, '
			+'<a href="/Shop/PicZoom3D/14/'+product+'.jpg">3D-14</a>, '
			+'<a href="/Shop/PicZoom3D/15/'+product+'.jpg">3D-15</a>, '
			+'<a href="/Shop/PicZoom3D/16/'+product+'.jpg">3D-16</a>, '
			+'<a href="/Shop/PicZoom3D/17/'+product+'.jpg">3D-17</a>'
	;
*/
	}else{
		// console.log('buffalo page');
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

		$('#productDescription').prepend('<div style="float: right; color: #333;">'+ html_wrapper('XL images: '+ list) +'</div>');
	}else{
		// console.log('zappos page');
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

function zeroPad(num,count){
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}

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

function html_wrapper(html_to_add){
    return '<div id="shop-companion" style=" margin-top: 5px; max-width: 300px; text-align: left;">'
	+'	<div style="padding: 3px 5px; border: 1px solid #ccc; border-radius: 5px 5px 0 0; background: #fafafa; color:#468; font-weight: bold;">'
	+ addon_name
	+'	</div>'
	+'	<div style="padding: 5px; border: 1px solid #ccc; border-radius: 0 0 5px 5px; border-top: 0; min-font-size: 1em;">'
	+ html_to_add
//	+'		<p>Do you...? <a href="#want_it">want it</a> <a href="#have_it">own it</a> <a href="#_had_it">had it</a></p>'
	+'	</div>'
	+'</div>';
}