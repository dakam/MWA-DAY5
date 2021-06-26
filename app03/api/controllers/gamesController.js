
const mongoose = require("mongoose");
const Game = mongoose.model("Game");


const statuses = {
    systemissue: 500,
    userIssue:400,
    fetchok:200,
    updateok:204,  
    resreceived:201,
}


module.exports.GamesGetAll= function(req, res) {

    let offset = 0;
    let count = 6;

    if(req.query && req.query.offset && req.query.count) {

        let offset = parseInt(req.query.offset, 0);
        let count = parseInt(req.query.count, 6);
           
        Game.find().skip(offset).limit(count).exec(function(err, fetchedgames) {
            console.log("Found Games");
            res.status(200).json(fetchedgames);
        });      
    }
    else {
     
        Game.find().exec(function(err, fetchedgames) {
            console.log(`We fetched Games ${fetchedgames}`);
            res.status(200).json(fetchedgames);

        });

    }

   

}


module.exports.GamesGetOne = function(req, res) {

  

    if(req.params.gameId) {

        const gameId = req.params.gameId;

        Game.findById(gameId).exec(function(err, games) {

           let  response = {
                message:games,
                status:statuses.resreceived,
            }

            if(err) {

                response.message= err;
                response.status= statuses.systemissue;

                
                console.log(`we encountered an Error : ${err}`)
            }
            else
            {

                console.log("One Found Games");
                res.status(201).json(games);
            }
         

        });

    } else {
        response.message  = "missing gameId";

        res.status(statuses.userIssue).json({"message":response.message});  

    }

}


module.exports.gamesAddOne = function (req, res) {
    console.log("new Game Add command received ");
   
    const newGame = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        year: parseInt(req.body.year),
        minAge: parseInt(req.body.minAge),
        rate: parseInt(req.body.rate),
        minPlayers: parseInt(req.body.minPlayers),
        maxPlayers: parseInt(req.body.maxPlayers),
        designers: req.body.designers,
        publisher: {}
    };

    Game.create(newGame, function (err, game) {
        const response = {
            status: statuses.resreceived,
            message: game
        };

        if (err) {
            console.log("There is an issue adding new Game");
            response.status = statuses.systemissue;
            response.message = err;
        }
        console.log("Added Game", game)
        res.status(response.status).json(response.message);
    });
}


module.exports.gamesFullUpdateOne = function (req, res) {
    console.log("Received Full Game update command")
    const gameId = req.params.gameID;
    if (gameId.length != 24) {
        res.status(statuses.userIssue).json({ "message": "GameId is not valid" });
        
    }

    Game.findById(gameId).exec(function (err, game) {

        const response = {
            status: 204,
            message: game
        };


        if (err) {
            console.log("Ann error was encounted while find the Game");
            response.status = statuses.systemissue;
            response.message = err;
        } 
        
        if (!game) {
            response.status = statuses.userIssue;
            response.message = { "message": "This game specified is not found" };
        }

        if (response.status !== statuses.updateok) {
           res.status(response.status).json(response.message);
        } else {
            

            console.log("we are updating the game here")
            game.title = req.body.title;
            game.price = parseFloat(req.body.price);
            game.year = parseInt(req.body.year);
            game.rate = parseInt(req.body.rate);
            game.minAge = parseInt(req.body.minAge);
            game.designers = req.body.designers;
            game.publisher = {};
            game.minPlayers = parseInt(req.body.minPlayers);
            game.maxPlayers = parseInt(req.body.maxPlayers);
     

            game.save(function (err, updatedGame) {
                console.log("updated Game is ", updatedGame);

                let response2 = {
                    status: 204,
                    message: game
                };

                if (err) {
                    response.status = statuses.systemError;
                    response.message = err;
                    console.log(" failure on game Full update", err)
                } else {
                    response.message = updatedGame;
                    console.log(" success on game Full update", updatedGame)
                    res.status(204).json({"message": updatedGame});
                }
               
            })


        }

    });
};


module.exports.GamesPartialUpdateOne = function (req, res) {
    console.log("Partial Update Request Received")
    const gameId = req.params.gameId;

    if (gameId.length != 24) {
        res.status(statuses.userIssue).json({ "message": "Please send a valid gameId" });
    }

    Game.findById(gameId).exec(function (err, game) {
        const response = {
            status: 204,
            message: game
        };

        console.log("partial Game here", game)

        if (err) {
            console.log("Error finding game");
            response.status = statuses.systemissue;
            response.message = err;
        } else if (!game) {
            response.status = statuses.userIssue;
            response.message = { "message": "Game ID not found" };
        }

        if (response.status !== 204) {
            res.status(response.status).json(response.message);
        } else {

            console.log("Currently here", req.body);
          

            if (req.body.title) {
                game.title = req.body.title;
            }

            if (req.body.price) {
                game.price = parseFloat(req.body.price);
            }

            if (req.body.year) {
                game.year = parseInt(req.body.year);
            }

            if (req.body.minPlayers) {
                game.minPlayers = parseInt(req.body.minPlayers);
            }
            if (req.body.rate) {
                game.rate = parseInt(req.body.rate);
            }

            if (req.body.designers) {
                game.designers = req.body.designers;
            }

            if (req.body.maxPlayers) {
                game.maxPlayers = parseInt(req.body.maxPlayers);
            }

            if (req.body.minAge) {
                game.minAge = parseInt(req.body.minAge);
            }

         


            game.save(function (err, updatedGame) {
                console.log("updated partial game", updatedGame)
                if (err) {
                    response.status = statuses.systemissue;
                    response.message = err;
                } else {
                    response.message = updatedGame;
                }

                res.status(201).json(response.message);

                return;
            })


        }

    });
};


module.exports.GamesDeleteOne = function (req, res) {

    const gameId = req.params.gameId;
    console.log("Game ID IS ", gameId);

    if(gameId.length !=24) {
        console.log("GameId is not a valid ID")
        res.status(400).json({"message":"Game ID is not valid"}); 
        return;
    }


        Game.findByIdAndRemove(gameId).exec(function(err, deletedGame) {

            let response= {
                status:204,
                message:deletedGame
            }

  
            if(err) {
                console.log("Error finding games", err);
                response.status=500;
                response.message=err;
               
            } else if(!deletedGame){

            console.log("GameId no found");
          
            response.status=400;
            response.message="Game no found";

            }



            res.status(response.status).json(response.message);

        });

};