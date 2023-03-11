const request = require('request');
const http = require('http')
const fs = require('fs')

const api = 'https://jsonbase.com/sls-team/vacations'

if(fs.existsSync('users.json') === false) {
    fs.writeFileSync('users.json', '[]')
}

let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
users = []

function formatJson() {
    request.get({url: api}, (err, response, body) => {
        if(!err && response.statusCode === 200) {
            createNewJson(JSON.parse(body))
        }
    })


    function createNewJson(data) {
        let vacation = {}

        if(data.length) {
            for(let i=0; i<data.length; i++) {
                if(vacation[data[i].user.name] !== undefined) {
                    vacation[data[i].user.name].push({
                        "startDate": data[i].startDate,
                        "endDate": data[i].endDate,
                    })
                } else {
                    vacation[data[i].user.name] = [
                        {
                            "startDate": data[i].startDate,
                            "endDate": data[i].endDate,
                        }
                    ]
                }
                    


                users.push({
                    "userId": data[i].user._id,
                    "userName": data[i].user.name,
                    "vacations": []
                })             
            }

            users.forEach(item => {
                item["vacations"] = vacation[item.userName]
            })

            users = users.sort((a, b) => {
                return a.userName > b.userName ? 1 : -1
            }).filter((item, index, arr) => {
                if(JSON.stringify(item) !== JSON.stringify(arr[index - 1])) {
                    return item
                }
            })

            console.log(users)
            fs.writeFileSync('users.json', JSON.stringify(users))
        }
        
    }
}

formatJson()