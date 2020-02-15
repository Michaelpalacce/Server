'use strict';


$( document ).on( 'contextmenu', '.item', ( e )=>
{
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();

	const box	= $( e.target.closest( '.item' ) );

	if ( box.hasClass( 'backFolderElement' ) || box.hasClass( 'addFolderElement' ) )
	{
		return;
	}

	const contextMenuElement	= $( ".contextmenu" );

	const winWidth				= $(document).width();
	const winHeight				= $(document).height();
	const posX					= e.pageX;
	const posY					= e.pageY;
	const menuWidth				= contextMenuElement.width();
	const menuHeight			= contextMenuElement.height();
	const secMargin				= 10;

	let posLeft, posTop;

	if( posX + menuWidth + secMargin >= winWidth && posY + menuHeight + secMargin >= winHeight )
	{
		posLeft	= posX - menuWidth - secMargin + "px";
		posTop	= posY - menuHeight - secMargin + "px";
	}
	else if ( posX + menuWidth + secMargin >= winWidth )
	{
		posLeft	= posX - menuWidth - secMargin + "px";
		posTop	= posY + secMargin + "px";
	}
	else if( posY + menuHeight + secMargin >= winHeight )
	{
		posLeft	= posX + secMargin + "px";
		posTop	= posY - menuHeight - secMargin + "px";
	}
	else
	{
		posLeft	= posX + secMargin + "px";
		posTop	= posY + secMargin + "px";
	}

	contextMenuElement.css({
		"left"	: posLeft,
		"top"	: posTop
	}).show();

	return false;
});

$( document ).click( ()=> {
	$( ".contextmenu" ).hide();
});