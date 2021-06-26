const mongoose = require("mongoose");
const Game = mongoose.model("Game");


const __addReview = function(req, res, game) {
    console.log("game=",game)
    console.log("reviews=", game.reviews)

    let length = game.reviews.length;
    console.log("length="+length);
    let review = parseFloat(req.body.review, 0)

    game.reviews.push({"name":req.body.name, "review":review, "date":req.body.date})

    game.save(function(err, updatedGame) {

        const response= {
            status:201,
            message:updatedGame
        }

        console.log("Updated game  is ",updatedGame)


        if(err) {
            console.log("Error Adding Review", err);
            response.status=500;
            response.message=err;
           
        }
        
        res.status(response.status).json(response.message);
    })
}


module.exports.ReviewAddOne = function(req, res) {
    console.log(req.body);
    const gameId= req.params.gameId;

    if(gameId.length != 24) {

        console.log("Game Id not valid");
            res.status(400).json({"message": "Game Id not valid"});
            return;
    }

    

    Game.findById(gameId).exec(function(err, game) {
        const response= {
            status:201,
            message:game
        }


        if(err) {
            console.log("Error finding games", err);
            response.status=500;
            response.message=err;
           
        }else if(!game) {

            console.log("Games ID not found");
            response.status=400;
            response.message="Game ID not found";
          
        } else if(game) {
            console.log("sending game for review add", game);
            __addReview(req, res, game);
           
        } else {

            res.status(response.status).json(response.message);

        }

       
    })
   
    
}

module.exports.ReviewsGetAll = function(req, res) {

    const gameId = req.params.gameId;

    if(gameId.length != 24) {

        console.log("Game Id not valid");
            res.status(400).json({"message": "Game Id not valid"});
            return;
    }


        Game.findById(gameId).select("reviews").exec(function(err, reviews) {

            const response= {
                status:201,
                message:reviews,
            }

            if(err) {
                response.message= err;
                response.status = 500;
            } else if(!reviews) {
              
                response.message= "Reviews no found";
                response.status = 400;

            }
            console.log("Review information", response.message);
            res.status(response.status).json(response.message);

        });

}


module.exports.ReviewsFullUpdateAll = function(req, res) {
    

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

                let length = game.reviews.length;
                console.log("length="+length);
                let review = parseFloat(req.body.review, 0)
                let name = req.body.name;
                let k =-1;

                for(let i=0; i<=game.reviews.length;i++) {

                    if(game.reviews[i] && game.reviews[i].name) {
                    let rname = game.reviews[i].name;
                   console.log("review name in loop", name )
                    

                        k=i;
                        break;

                
                }
                
                }

                if(k>-1) {

                    game.reviews[k] ={"name":req.body.name, "review":review, "date":req.body.date}
                }


                
                game.save(function(err, updatedGame) {
                    if(err) {
                        res.status(500).json(error)
                    } else {

                        response.message= updatedGame.reviews;
                        res.status(response.status).json(response.message)
                    }
                })
            }
      

        });

}

const checkReviewEquality = function(s1, s2) {
    if(s1.equals(s2)) {
        return true;
    }
    return false;

}

module.exports.ReviewDeleteOne= function(req, res) {
    console.log("Review delete one req received");

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
               
                let length = game.reviews.length;
                console.log("length="+length);
                  
                    game.reviews =[];
                 
              
                game.save(function(err, deletedGame) {
                    if(err) {
                        res.status(500).json(err)
                    } else {

                       
                        console.log("Deleted Review", deletedGame)
                       
                        response.message= deletedGame
                        res.status(200).json({deletedGame})
                        return;
                       
                    }
                })
            }

          
        
        });

       
                       
}