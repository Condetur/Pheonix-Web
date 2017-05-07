### Pheonix - Web
This is the code for the server and website logic of a project here at Horace Mann.

### How it is built
The actual code which runs the server lives in `src/server/index.js`. The server first sets up `express`, `ejs`, and a bunch of useful middlewares. Afterwards, a process of `gulp` is launched.

The `gulp` instance compiles `less` files located under `src/assets/less` into `css` and places them in `src/public/css`. It also takes the `app.js` file located under `src/assets/js/app.js` and converts it to standard `es5` code as well as minifies it into one line of code.

The method of writing routes was designed to be easy and fast. All routes are located under `src/server/index.js`. To declare a route, create a new object with information in this order: `[method, url, controller@Method, view, title]`. What does the `controller@Method` mean? 

Each controller is a series of functions located under `src/server/controllers`. To call a controller, you state the name of the controller: for example `conference` and then the method you want to use, like `createConfernce`. You join the two with an `@` symbol. As a result, you get something like this: `conference@createConference`. All controllers must have the word Controller attached to the end of the filename, it won't work otherwise. 

If you don't need a controller but only a view, set the controller option equal to `null` and simply state the name of your view, such as `create.ejs`.

To make calls from the client to the server, we use `ajax` and `jquery`. It is fast, efficient, and supported by pretty much every browser.

### How to run the code
To run the code which currently lives here, you will require a couple of things. First download `node.js` from the `nodejs` website. You will also need a working installment of `mysql` with the correct database and table structures. Once you have that, download this code and cd into the directory. Then type `npm i` to download all of the dependencies as well as `npm i -g gulp`. Afterwards, type `npm run dev`. You will have a working website at this url: `localhost:3000`.

### Thanks for reading!