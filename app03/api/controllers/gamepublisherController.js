const mongoose = require("mongoose");
const Game = mongoose.model("Game");


const __addPublisher = function(req, res, game) {
    console.log("name=",req.body.name)
    console.log("country=",req.body.country)

    game.publisher[0].country = req.body.country;
    game.publisher[0].name = req.body.name;

   
    game.save(function(err, updatedGame) {

        const response= {
            status:201,
            message:updatedGame.publisher
        }

        console.log("updated game is ",updatedGame)


        if(err) {
            console.log("Error UPDATING publisher", err);
            response.status=500;
            response.message=err;
           
        }
       
        console.log(response.message)
        
        res.status(response.status).json(response.message);
    })
}


module.exports.publisherFullUpdateOne = function(req, res) {
    

    const gameId = req.params.gameId;

    if(gameId.length != 24) {

        console.log("Game Id not valid");
            res.status(400).json({"message": "Game Id not valid"});
            return;
    }


        Game.findById(gameId).exec(function(err, game) {

            const response= {
                status:201,
                message:game,
            }

            if(err) {
                response.message= err;
                response.status = 500;

            } else if(!game) {
                

                response.message= "GameID not found";
                response.status = 500;

            }
            if(response.status !=201) {
                console.log("Game is not valid", response.message)
                res.status(response.status).json(response.message);

            }

            if(game) {
                game.publisher[0].name = req.body.name;
                game.publisher[0].country = req.body.country;
                game.save(function(err, updatedGame) {
                    if(err) {
                        res.status(500).json(error)
                    } else {

                        response.message= updatedGame.publisher;
                        res.status(response.status).json(response.message)
                    }
                })
            }
      

        });

}





module.exports.publisherGetOne = function(req, res) {

    const gameId = req.params.gameId;

    if(gameId.length != 24) {

        console.log("Game Id not valid");
            res.status(400).json({"message": "Game Id not valid"});
            return;
    }


        Game.findById(gameId).select("publisher").exec(function(err, publisher) {

            const response= {
                status:201,
                message:publisher,
            }

            if(err) {
                response.message= err;
                response.status = 500;
            } else if(!publisher) {
              
                response.message= "Publisher no found";
                response.status = 400;

            }
            console.log("Publisher information", response.message);
            res.status(response.status).json(response.message);

        });

}


module.exports.publisherAddOne = function(req, res) {
    //console.log(req.body);
    const gameId= req.params.gameId;

    if(gameId.length != 24) {

        console.log("Game Id not valid");
            res.status(400).json({"message": "Game Id not valid"});
            return;
    }

    console.log("gameid=", gameId);

    Game.findById(gameId).exec(function(err,  game) {
        const response= {
            status:201,
            message:game
        }


        console.log("game =", game)
        if(err) {
            console.log("Error finding games", err);
            response.status=500;
            response.message=err;
           
        }else if(!game) {

            console.log("Games ID not found");
            response.status=400;
            response.message="Game ID not found";
          
        } else if(game) {
            console.log("sending game", game);
            __addPublisher(req, res, game);
           
        } else {

            res.status(response.status).json(response.message);

        }

       
    })
   
    
}

module.exports.publisherDeleteOne= function(req, res) {
    console.log("publisher delete one req received");

    const gameId = req.params.gameId;

    if(gameId.length != 24) {

        console.log("Game Id not valid");
            res.status(400).json({"message": "Game Id not valid"});
            return;
    }


        Game.findById(gameId).exec(function(err, game) {



          const response= {
                status:204,
                message:game,
            }

            if(err) {
                response.message= err;
                response.status = 500;

            } else if(!game) {
                

                response.message= "GameID not found";
                response.status = 500;

            }
            if(response.status !=204) {
                console.log("Game is not valid", response.message)
                res.status(response.status).json(response.message);

            }


            if(game) {
                game.publisher[0] = {};
                game.save(function(err, updatedGame) {
                    if(err) {
                        res.status(500).json(err)
                    } else {

                        console.log("Deleted Publisher", updatedGame)
                       
                        response.message= updatedGame
                        res.status(response.status).json(updatedGame)
                    }
                })
            }
        
        });

}