mplayer.js
==========

My first foray in to node.js and my first repository on github.  So expect mistakes...
Just for fun really, I was recently asked "have you not got bored of PHP?", so I decided to try node.js.

What is it
----------
mplayer.js is a simple app written in node.js(backend) with some html5 and jQuerymobile for the front.  You can choose which file to play on the server, move back and forth, pause, full screen, turn on off subtitles.  Yeah, simple enough...

The [Express](http://expressjs.com/) MVC framework is used, again, I am use'd to Symfony in PHP and like the idea of MVC.

To get it going
---------------
You need
- node.js
- [mplayer](http://www.mplayerhq.hu)
- Then (which is rather cool, and like [composer.phar](http://getcomposer.org/)) use npm to get the stuff as defined in package.json. Read [here](http://expressjs.com/guide.html) first, it might help.

       >$ npm install
- change the root_dir in routes/mplayer.js to suit you.
Then simply run the app, and point your browser to your server e.g. http://localhost:3000/mplayer.

Yet to do - improvements
--------
- blog a more comprehensive how to install.
- make the file selector more usable, even simple thing like jump to the controls when a video has been selected.
- would be nice if the root folder to look in for Videos was feed in as a parameter in command line, or from a nice config file.
- does it work on an Apple MAC, does and Apple MAC have mplayer?
- Security?
    There is no login, so anybody that can get to port 3000 has access to the running node.
    Is there any thing else that could allow some body to run some arbitrary code/command on the server?
- Ability select which audio stream to use.
- Ability select which subtitle stream to use.
- Cue another video.
- Only list videos!


Bugs
----
(cough)
