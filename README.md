# decifer

>Decifer is a sleek, lightweight package that provide, developers with mostly rare tools and long extract tools such as youtube_video downloads and media_type_identifiers, etc.

[![Socket Badge](https://badge.socket.dev/npm/package/decifer/0.0.1)](https://badge.socket.dev/npm/package/decifer/0.0.1)


 ## 🛠️ Installation
  Install the package directly into your project via the npm:

```bash
npm install decifer
```

### some kits available are:
 >toBinary - convert normal text to 1s & 0s or computer bytes.

 >toUtf8 - convert computer bytes 1s & 0s normal text.

 >ytvid - download youtube video via youtube valid url.


CommonJs:
```javascript
  // CommonJS
    var matrix = require('decifer');
    var Matrix = new matrix();

    var computerBinary = Matrix.toBinary('Text to binary');
    console.log(computerBinary)
    console.log(typeof computerBinary) //string

    var humanReadable = Matrix.toUtf8('10101011000');
    console.log(humanReadable)  // readable string

 ```


ES module example:
```typescript
    // TypeScript

    import matrix from 'decifer';

    var Matrix = new matrix();

    var computerBinary:string = Matrix.toBinary('Text to binary');
    console.log(computerBinary)
    console.log(typeof computerBinary) //string

    var humanReadable:string = Matrix.toUtf8('10101011000');
    console.log(humanReadable)  // readable string
```


## Youtube end_point

#### ES Module as default:
```javascript
  // ESM
import matrix from 'decifer';
var Matrix = new matrix();

 //define the url endpoint => optional
var yt_url = `https://youtube.com/..`; // type string

//for JSON of valod video url
   var json_format_data = await Matrix.ytvid(yt_url, { json:true });
   console.log(json_format_data);  //output_type : string
 ```



### Youtube default_fallback

*ES Module as default, fallback:*

>if no format option is given, it defaults to disk install. The media gets installed onto the server in the home_directory, and if { asBuffer:true } option is called, media data is rather stored as buffer in the memory than on disk.

```javascript
var yt_url = `youtube_url`;
var yt_get = await Matrix.ytvid(yt_url);
 console.log(yt_get) //output : media_saved path default to the home_directory, asBuffer option overrides to memory than disk. i.e

var yt_get = await Matrix.ytvid(yt_url,{ asBuffer:true });
 console.log(yt_get instanceof Buffer)  //output: true
```




### Youtube-merge

*ES Module as default:*
```javascript
var yt_url = `youtube_url`;
var yt_get = await Matrix.ytvid(yt_url,{ merge:true });
 console.log(yt_get) //output : string of bot audio and mp4 mixed;
```


### Youtube-dual

*ES Module as default:*
```javascript
var yt_url = `youtube_url`;
var yt_get = await Matrix.ytvid(yt_url,{ dual:true });
 console.log(yt_get) //output : object of youtube link in audio_only and video_only url
```





# Media_Type endpoint

*ES Module as default:*
```javascript
 // media_type class func is synchronous so need for an async/await block if individual.

import matrix from 'decifer';
var Matrix = new matrix();
/*
this feature only support media such as mp4 or png or quicktime or any type that you do not have any idea what it bytes holds, zips are also supported.
*/
var path_to_media_only_file = '/path/to/media/wrong_format.png';

// will throw an error if not param is given i.e the path to the media;

var mediaType = Matrix.getMediaType(path_to_media_only_file);
console.log(mediaType) //output: video/quicktime. we take the media_file to be the wrong or unknown extension, this feature figure it out synchronously;
```





### randomUUID 

*ES Module as default:*
```javascript
import matrix from 'decifer';
var Matrix = new matrix();
var UUID = Matrix.randomUUID();
console.log(UUID) //output : xxxxxxx-xxxxxx-xx..
```


# video_globalizing:
> some media contains formats or bytes that modern devices or some devices do not support, and this function is just in to sort that out, it converts the video { mp4, avi and many other more video_formats } to a global video format. Each atom or byte of that video is re_encoded with ffmpeg one at a time but with high preset.

> options - { asBuffer:true } => to receive data in buffer instead of direct disk.

> [!WARNING]
> Enabling **{ rapid:true }** in class.globalize() will result in a high file size but speed up the work process.

> [!IMPORTANT]
> If the media is being processed with a path than buffer, its final outpu will always be compiled to an *MP4* with a .mp4 extention

*ES Module as default:*
```javascript
import matrix from 'decifer';
var Matrix = new matrix();
var vid_data = `pathToVideo_or_bufferOfVideo`;

var global_vid = Matrix.globalize(vid_data);
console.log(globa_vid) //output: raw compiled_media_buffer || path to compiled video.mp4

```


## Features

*   **Zero Dependencies;**
    
*   **Performance First:** Built for high-performance throughout string and binary node manipulation.
  
*   **youtube download_feature** this binary access the internee to fetch the latest, binaries for ytdlp and also to avoid download delays, tye system fetches the heavy bins, right after install and initialization. All binaries are fetched according to your system architecture.

     📄 License

  This project is licensed under the **MIT License**. You are completely free to modify, distribute, and integrate this software into private or commercial environments. See the `LICENSE` file for more details.

    
    🖤 cyber cyphers
