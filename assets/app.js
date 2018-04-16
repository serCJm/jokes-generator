window.onload = function () {

    function get(url) {
        return new Promise(function (resolve, reject) {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);

            if (!xhr) {
                console.log("Can't create XMLHttp Instance");
                return false;
            }

            xhr.onload = requestContents;

            xhr.onerror = function () {
                reject({
                    status: this.statusText,
                    statusText: this.statusText
                });
            }

            xhr.send();

            function requestContents() {
                if (this.status === 200) {
                    resolve(JSON.parse(this.response));
                } else {
                    reject('Connected to a server but returned an error. Status: ' + this.status + '. Text: ' + this.statusText);
                }
            }

        });
    }

    let jokes = get('https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten');
    let chuck = get('http://api.icndb.com/jokes/random/5');
    
    Promise.all([jokes, chuck]).then(function (data) {
        // put all data into one array
        let allJokes = arrayData(data);
        // select element where display jokes
        let tiles = document.getElementById('tiles');
        createJoke.call(allJokes, tiles);
        
    }).catch(function (error) {
        console.log(error)
    });
 
    // go over received data and extract jokes
    function arrayData(dataArr) {
        // misc jokes
        let miscJokes = dataArr[0];
        // chuck norris jokes
        let chuckJokes = dataArr[1];
        console.log(chuckJokes);
        let allJokes = [];
        for (let joke of miscJokes) {
            allJokes.push(joke.setup);
            allJokes.push(joke.punchline);
        }
        for (let joke of chuckJokes.value) {
            console.log(joke);
            allJokes.push(joke.joke);
        }
        return allJokes;
    }

    function createJoke(parent) {
        for (let joke of this) {
            let htmlH1 = document.createElement('h1');
            let text = document.createTextNode(joke);
            htmlH1.classList.add('joke');
            htmlH1.appendChild(text);
            parent.appendChild(htmlH1);
        }
    }

}