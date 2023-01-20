const { io }  = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');


const bands = new Bands();

bands.addBand( new Band( 'Trym' ));
bands.addBand( new Band( 'Parfait' ));
bands.addBand( new Band( '99999999' ));
bands.addBand( new Band( 'CeraKin' ));

// Mensajes de Sockets
io.on('connection', client => {    
    console.log('Cliente Conectado')

    client.emit('Active-Bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Cliente Desconectado')
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje!!!', payload);
        
        io.emit('mensaje', { admin: 'Nuevo mensaje'})
    });

    // Emitir crear nueva banda
    client.on('add-band', (payload) => {

        const newBand = new Band( payload.name );
        bands.addBand( newBand );
        io.emit('Active-Bands', bands.getBands() );

    });

    // Emitir borrar nueva banda
    client.on('delete-band', (payload) => {

        bands.deleteBand(payload.id);
        io.emit('Active-Bands', bands.getBands() );

    });

    // Emitir el votar por una banda
    client.on('vote-band', (payload) => {

        bands.voteBand(payload.id);
        io.emit('Active-Bands', bands.getBands() );

    });
      
});