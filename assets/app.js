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
        createJokeEl.call(allJokes, tiles);

    }).catch(function (error) {
        console.log(error)
    });

    // go over received data and extract jokes
    function arrayData(dataArr) {
        // misc jokes response
        let miscJokes = dataArr[0];
        // chuck norris jokes response
        let chuckJokes = dataArr[1];
        // array for storing jokes
        let allJokes = [];
        // extract misc jokes
        for (let joke of miscJokes) {
            allJokes.push(joke.setup + ' ' + joke.punchline);
            
        }
        // extract chuck jokes
        for (let joke of chuckJokes.value) {
            allJokes.push(joke.joke);
        }
        // shuffle entries in data array
        shuffleArray.call(allJokes);
        return allJokes;
    }

    // create an element for each joke
    function createJokeEl(parent) {
        // for each joke in data array
        // append the joke to the div in h2 tag
        let filledAreas = [];
        for (let joke of this) {
            let htmlH1 = document.createElement('h2');
            let text = document.createTextNode(joke);
            htmlH1.classList.add('joke');
            htmlH1.appendChild(text);
            parent.appendChild(htmlH1);
            // randomly position an element
            // randomPositioning.call(htmlH1, filledAreas);
        }
    }

    function shuffleArray() {
        let counter = this.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = this[counter];
            this[counter] = this[index];
            this[index] = temp;
        }
        return this;
    }

    // function randomPositioning(filledAreas) {
    //     let rangeX = 0;
    //     let rangeY = this.getBoundingClientRect().height;
    //     console.log(rangeY);
    //     let randomX;
    //     let randomY;
    //     let area;
    //     let i = 0;
    //     do {
    //         randomX = Math.floor(Math.random() * (window.innerWidth - 300));
    //         randomY = Math.floor(Math.random() * (window.innerHeight - rangeY))
    //         console.log(randomX);
    //         area = {
    //             x: randomX,
    //             y: randomY,
    //             width: 300,
    //             height: rangeY
    //         }
    //         i++;
    //     } while (checkOverlap.call(area, filledAreas) || i==20);

    //     filledAreas.push(area);
    //     console.log(filledAreas);
    //     this.style.left = randomX + 'px';
    //     this.style.top = randomY + 'px';
    // }

    // function checkOverlap(filledAreas) {
    //     for (let entry of filledAreas) {
    //         if (this.y + this.height < entry.y || this.y > entry.y + entry.height || this.x + 300 < entry.x || this.x > entry.x + 300) {
    //             continue;
    //         }
    //         return true;
    //     }
    //     return false;
    // }

}