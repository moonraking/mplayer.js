var spawn = require( 'child_process' ).spawn;
var crypto = require( 'crypto' );
var fs = require( 'fs' );
var util = require( 'util' );

var file = '';
var root_dir = '/home/shane/Videos';
var status =    {
                    running: false,
                    filename: '',
                    pause: 1,
                    length: '',
                    time_pos: '',
                    percent_pos: '',
                    volume: '',
                    fullscreen: 0,
                    subs: 0
                }

var files_hash = {}; //will be a list of hashes againt file name
var files_obj = [];
var tmplayer = null; //the spawn of mplayer

setInterval( get_status, 1000);
build_filesSync( root_dir );
//console.log(util.inspect(files_hash, true, null, true));

function build_filesSync( dir ){

    var obj = [];
    var files = fs.readdirSync(dir);
    for( var i = 0; i < files.length; i++){
            var full_path = dir + "/" + files[i];
            var stats = fs.statSync( full_path );
            var tmp_file = {};
            tmp_file.name = files[i];
            if( stats.isDirectory() )
            {
                tmp_file.files = build_filesSync( full_path );
            }else{
                tmp_file.hash = md5(full_path);
                files_hash[tmp_file.hash] = full_path;
            }
            obj.push( tmp_file );
    }

    //console.log(util.inspect(obj, null, true));
    return obj;
}

function md5(str) {
    var hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

function get_status()
{
    if( status.running ){
        tmplayer.stdin.write( 'pausing_keep_force get_property filename\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property pause\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property length\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property time_pos\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property percent_pos\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property volume\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property fullscreen\n' );
        tmplayer.stdin.write( 'pausing_keep_force get_property sub_visibility\n' );
    }
}

function add_tmplayer_watch(){
    tmplayer.stdout.on('data', function (data) {
        //now as we get stuff from the console, update the status object
        var lines = data.toString().split('\n');
        var results = new Array();
        lines.forEach(function(line) {
            var parts = line.split('=');
            switch(parts[0]){
                case 'ANS_filename':
                    status['filename'] = parts[1];
                    break;
                case 'ANS_pause':
                    status['pause'] = (parts[1] == 'yes' ) ? 1 : 0 ;
                    break;
                case 'ANS_length':
                    status['length'] = parts[1];
                    break;
                case 'ANS_time_pos':
                    status['time_pos'] = parts[1];
                    break;
                case 'ANS_percent_pos':
                    status['percent_pos'] = parts[1];
                    break;
                case 'ANS_volume':
                    status['volume'] = parts[1];
                    break;
                case 'ANS_fullscreen':
                    status['fullscreen'] = (parts[1] == 'yes' ) ? 1 : 0 ;
                    break;
                case 'ANS_sub_visibility':
                    status['subs'] = (parts[1] == 'yes' ) ? 1 : 0 ;
                    break;
            }
            //console.log( ':::' + line );
        });
    });

    tmplayer.stderr.on('data', function (data) {
            //console.log( '---' + data );
    });

}


exports.index = function(req, res){
    res.render('mplayer/index', { title: 'Mr Mplayer' });
};

exports.status = function(req, res){
    res.send(status);
};

exports.pause = function(req, res){
    tmplayer.stdin.write( 'pause\n' );
    // cough, lets toggle the pause status :/, yeah, am not clever enough....
    status['pause'] = status['pause']? 0 :1;
    res.send(status);
};

exports.fullscreen = function(req, res){
    status['fullscreen'] = status['fullscreen']? 0 :1; //toggle
    tmplayer.stdin.write( 'pausing_keep_force vo_fullscreen '+status['fullscreen']+'\n' );
    res.send(status);
};

exports.subs = function(req, res){
    status['subs'] = status['subs']? 0 :1; //toggle
    tmplayer.stdin.write( 'pausing_keep_force sub_visibility '+status['subs']+'\n' );
    res.send(status);
};


exports.seek = function(req, res){
    step = parseInt(req.query.step); //in seconds
    tmplayer.stdin.write( 'seek ' + step + '\n' );
    res.send(status);
};

exports.play = function(req, res){
    var file = files_hash[req.query.file_hash];
    console.log( 'Attempting to play hash:' + req.query.file_hash + ' mapped to: ' + file );
    if( status.running != true ){
        tmplayer = spawn( 'mplayer', [ '-quiet', '-slave', file ] );
        status.running = true;
        tmplayer.on( 'exit', function () { console.log( 'EXIT.' ); status.running = false; } );
        add_tmplayer_watch();
    }else
    {
        tmplayer.stdin.write( 'loadfile "'+ file +'"\n' );
    }

    res.send(status);
};

exports.files = function(req, res){
    files_obj = build_filesSync( root_dir );
    //console.log( util.inspect(files_obj, null, true) );
    //console.log( util.inspect(files_hash, null, true) );

    res.send( files_obj );
};