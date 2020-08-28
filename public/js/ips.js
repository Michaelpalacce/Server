$( document ).on( 'click', '#getPublicIp', ( event ) => {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();

	$.ajax({
		url		: '/ip/public',
		method	: 'GET',
		success	:( ip ) => {
			modal.show( `Your Public IP is: ${ip}` )
		},
		error	: ( jqXHR ) => {
			modal.show( jqXHR.responseText );
		}
	});

	return false;
});

$( document ).on( 'click', '#getPrivateIps', ( event ) => {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();

	$.ajax({
		url		: '/ip/private',
		method	: 'GET',
		success	:( ips ) => {
			let result	= '';
			ips			= JSON.parse( ips );

			for ( const networkInterface in ips )
			{
				result	+= `Network Interface: ${networkInterface}`;
				result	+= '<br>';
				result	+= 'Ips: &emsp;';

				for ( const ip of ips[networkInterface] )
				{
					result	+= ip + '&emsp;';
				}

				result	+= '<br>';
				result	+= '<br>';
			}

			modal.show( result, true )
		},
		error	: ( jqXHR ) => {
			modal.show( jqXHR.responseText );
		}
	});

	return false;
});