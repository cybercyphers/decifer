# decifer

>Decifer is a sleek, lightweight package that provide, developers with mostly rare tools and long extract tools such as youtube_video downloads and media_type_identifiers, etc.

[![Socket Badge](https://badge.socket.dev/npm/package/decifer/0.0.1)](https://badge.socket.dev/npm/package/decifer/0.0.1)

    ---

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
    var matrix = require(‘decifer’);
    var Matrix = new matrix();

    var computerBinary = Matrix.toBinary('Text to binary');
    console.log(computerBinary)
    console.log(typeof computerBinary) //string

    var humanReadable = Matrix.toUtf8('10101011000');
    console.log(humanReadable)  // readable string

    ```


    ES module example:
    ```typescript
    // TypeScript or Javascript

    import matrix from 'decifer';

    var Matrix = new matrix();

    var computerBinary:string = Matrix.toBinary('Text to binary');
    console.log(computerBinary)
    console.log(typeof computerBinary) //string

    var humanReadable:string = Matrix.toUtf8('10101011000');
    console.log(humanReadable)  // readable string
    ```


    ## 🎛️ Core Features

    *   **Zero Dependencies;**
    *   **Performance First:** Built for high-throughput string and binary node manipulation.
    *   **Matrix Aesthetic:** Clean and predictable...

    ## 📄 License

    This project is licensed under the **MIT License**. You are completely free to modify, distribute, and integrate this software into private or commercial environments. See the `LICENSE` file for details.

    ---
    *Maintained with 💻 by Cyber Cyphers.*
