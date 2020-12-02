var Heap = cc.Class.extend({
    heap: [],
    ctor: function(){

    },

    getMin: function(){
        return this.heap[0];
    },

    insert: function(node){
        this.heap.push(node);
        this.upHeap();
    },

    upHeap: function() {
        var heapLength = this.heap.length;
        if(heapLength > 0){
            //travel from bottom to parent
            var i = heapLength - 1;
            while (i > 0){
                var parentIndex;
                if (i % 2) parentIndex = Math.floor(i / 2);
                else parentIndex = Math.floor(i / 2) - 1;
                if (this.heap[parentIndex].f < this.heap[i].f) break;
                //swap with parent
                this.swap(i, parentIndex);
                //update index
                i = parentIndex;
            }
        }
    },

    removeMin: function(){
        var result = this.getMin();

        var heapLength = this.heap.length;
        if (heapLength > 1){
            this.heap[0] = this.heap[heapLength - 1];
            this.heap.splice(heapLength - 1);

            //2 elements
            //if (heapLength == 2){
            //    if (this.heap[0].f > this.heap[1].f){
            //        this.swap(0, 1);
            //    }
            //}
            this.downHeap(0);
        } else if (heapLength == 1){
            this.heap.splice(0, 1);
        } else return null;
        return result;
    },

    downHeap: function(n){
        var i = n;
        var leftChild = i * 2 + 1;
        var rightChild = i * 2 + 2;

        while (this.heap[leftChild] &&
        this.heap[rightChild] &&
        (this.heap[i].f > this.heap[leftChild].f ||
        this.heap[i].f > this.heap[rightChild].f)) {
            if (this.heap[leftChild].f < this.heap[rightChild].f) {
                //swap current with left child
                this.swap(i, leftChild);
                i = leftChild;
            } else {
                //swap current with right child
                this.swap(i, rightChild);
                i = rightChild;
            }

            leftChild = i * 2 + 1;
            rightChild = i * 2 + 2;
        }
        if (this.heap[rightChild] === undefined && this.heap[leftChild] && this.heap[leftChild].f < this.heap[i].f) {
            //swap current with left child
            this.swap(i, leftChild);
        }
    },

    swap: function(index1, index2){
        var temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    },

    clear: function(){
        this.heap = [];
    },

    isEmpty: function(){
        return this.heap.length == 0;
    },

    reScore: function(node){
        var self = this;
        for (var i = 0; i < this.heap.length; i++){
            if (node.x == self.heap[i].x && node.y == self.heap[i].y){
                self.heap[i] = node;
                self.downHeap(i);
                break;
            }
        }
    }
});

var Node = cc.Class.extend({
    x: null,
    y: null,
    id: null,
    //for walls
    weight: 1,
    f: 0,
    g: 999999999,
    h: 0,
    parent: null,
    visited: false,
    closed: false,
    ctor: function(x, y, weight){
        this.x = x;
        this.y = y;
        this.id = weight;
    },
    setValues: function(g, h){
        this.h = h;
        this.g = g;
        this.f = h + g;
    },
    cantMoveTo: function(){
        return this.id != -1;
    }
});

var Astar = cc.Class.extend({
    openList: null,
    nodeMap: [],
    ctor: function(){
        //this._super();
        this.openList = new Heap();
    },
    search: function(mapGrid, mapGridW, mapGridH, troopX, troopY, destinationX, destinationY, id){
        var self = this;
        //generate nodeMap
        for (var i = 0; i < mapGridW; i++){
            self.nodeMap[i] = [];

            for (var j = 0; j < mapGridH; j++){
                var node = new Node(i, j, mapGrid[i][j]);
                
                self.nodeMap[i][j] = node;
                //cc.log(JSON.stringify(node));
            }
        }

        //initial open list
        var openList = this.openList;
        openList.clear();

        // cc.log(troopX + " troop " + troopY);
        var start = this.nodeMap[troopX][troopY];
        var end = this.nodeMap[destinationX][destinationY];

        //start
        var startH = this.heuristic(start, end, id);
        //cc.log(startH);
        start.setValues(0, startH);
        openList.insert(start);

        while(!openList.isEmpty()){
            //grab lowest f(x)
            var currentNode = openList.removeMin();

            //goal state
            if (currentNode == end){
                //get the path
                return this.tracePath(currentNode);
            }

            //move current node to close
            currentNode.closed = true;

            //find neighbors
            var neighbors = self.getNeighbors(currentNode);

            for (var i = 0; i < neighbors.length; i++){
                var neighbor = neighbors[i];
                //ignore node that cant move to

                if (neighbor.closed) continue;
                if(neighbor.cantMoveTo()){
                    if (neighbor.id != end.id)
                        continue;
                }

                //calculate g score
                var gScore = currentNode.g + neighbor.weight;
                var beenVisited = neighbor.visited;
                //check if this path is the shortest one so far
                if (!beenVisited || gScore < neighbor.g){
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    var neighborH = neighbor.h || self.heuristic(neighbor, end, id);
                    neighbor.setValues(gScore, neighborH);
                }

                if(!beenVisited){
                    //if not visited, add it to the open list
                    openList.insert(neighbor);
                } else {
                    //else, re order it in the heap
                    openList.reScore(neighbor);
                }
            }
        }
        //no result
        return [];
    },
    heuristic: function(node0, node, id){
        var numberOfHeuristics = 3;
        if (id % numberOfHeuristics == 0){
            //manhattan distance
            if (node != undefined){
                var d1 = Math.abs(node.x - node0.x);
                var d2 = Math.abs(node.y - node0.y);
                return Math.floor(d1 + d2);
            }
            else return 0;
        }
        else if (id % numberOfHeuristics == 1) {
            //euclidean
            if (node != undefined){
                var D = 1;
                var d1 = Math.abs(node0.x - node.x);
                var d2 = Math.abs(node0.y - node.y);
                return Math.floor(D * (d1 * d1 + d2 * d2));
            }
            else return 0;
        }
        else {
            //diagonal
            if (node != undefined){
                var D = 1;
                var D2 = Math.sqrt(2);
                var d1 = Math.abs(node0.x - node.x);
                var d2 = Math.abs(node0.y - node.y);
                return Math.floor((D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2)));
            }
            else return 0;
            
        }
    },
    tracePath: function(node){
        var currentNode = node;
        var result = [];
        while (currentNode.parent){
            result.unshift(currentNode);
            currentNode = currentNode.parent;
        }
        return result;
    },
    getNeighbors: function(node){
        var result = [];
        //north x, y + 1
        try{
            if (this.nodeMap[node.x][node.y + 1] != undefined)
                result.push(this.nodeMap[node.x][node.y + 1]);
            //north east x + 1 y + 1
            if (this.nodeMap[node.x + 1][node.y + 1] != undefined)
                result.push(this.nodeMap[node.x + 1][node.y + 1]);
            //east x + 1, y
            if (this.nodeMap[node.x + 1][node.y] != undefined)
                result.push(this.nodeMap[node.x + 1][node.y]);
            //south east x + 1, y - 1
            if (this.nodeMap[node.x + 1][node.y - 1] != undefined)
                result.push(this.nodeMap[node.x + 1][node.y - 1]);
            //south x, y - 1
            if (this.nodeMap[node.x][node.y - 1] != undefined)
                result.push(this.nodeMap[node.x][node.y - 1]);
            //north west x - 1, y - 1
            if (this.nodeMap[node.x - 1][node.y - 1] != undefined)
                result.push(this.nodeMap[node.x - 1][node.y - 1]);
            //west x - 1, y
            if (this.nodeMap[node.x - 1][node.y] != undefined)
                result.push(this.nodeMap[node.x - 1][node.y]);
            //north west x - 1, y + 1
            if (this.nodeMap[node.x - 1][node.y + 1] != undefined)
                result.push(this.nodeMap[node.x - 1][node.y + 1]);
        } catch(e){

        }
        return result;
    }
});

var TroopUtils = cc.Class.extend(({
    ctor: function(){
        //this._super();
        //this._openList = new Heap();
    },
    findPath: function(mapGrid, mapGridW, mapGridH, troopX, troopY, destinationX, destinationY, id){
        var astar = new Astar();
        var path;
        //var tmp = Date.now();
        path = astar.search(mapGrid, mapGridW, mapGridH, troopX, troopY, destinationX, destinationY, id);
        //cc.log("find path ", Date.now() - tmp)
        return path;
    },
    findTarget: function(troop){
        var result = {
            id: null,
            x: null,
            y: null
        };
        // var self = this;
        var troopPos = gv.isometricUtils.isoToX3TilePos(cc.p(troop._x, troop._y));
        switch (troop._name){
            case res.Troop.name.barrack:
                var buildingList = gv.objectManager.getBuildingIdList();
                // cc.log(JSON.stringify(buildingList));
                var minDistance = 999999999;
                buildingList.forEach(function(buildingId){
                    var building = gv.objectManager.getObjectById(buildingId);
                    if (building.isWall()){
                        return;
                    }
                    var buildingPos = gv.objectManager.getObjectIsoPositionById(buildingId);
                    var buildingGridPos = gv.isometricUtils.isoToX3TilePos(buildingPos);
                    // cc.log("building " + building.width + " " + building.height);
                    var centerX = [1, 1, -1, -1];
                    var centerY = [1, -1, -1, 1];
                    var deltaX = [0, 0, building.width * 3 - 1, building.width * 3 - 1];
                    var deltaY = [0, building.height * 3 - 1, building.height * 3 - 1, 0];
                    for (var i = 0; i < deltaX.length; i++){
                        var buildingGridX = buildingGridPos.x + deltaX[i];
                        var buildingGridY = buildingGridPos.y + deltaY[i];
                        var distance = Math.floor(Math.sqrt((troopPos.x - buildingGridX)*(troopPos.x - buildingGridX) + (troopPos.y - buildingGridY)*(troopPos.y - buildingGridY)));
                        
                        // cc.log(distance);
                        if (distance < minDistance){
                            result.id = buildingId;
                            result.x = buildingGridX + centerX[i];
                            result.y = buildingGridY + centerY[i];
                            minDistance = distance;
                            var horizontal = 0;
                            var edge = troop._id % 2;
                            var edgeVectorX;
                            var edgeVectorY;
                            if (edge == horizontal){
                                if (i == 0 || i == 1){
                                    edgeVectorX = 1;
                                    edgeVectorY = 0;
                                } else {
                                    edgeVectorX = -1;
                                    edgeVectorY = 0;
                                }
                            } else {
                                if (i == 0 || i == 3){
                                    edgeVectorX = 0;
                                    edgeVectorY = 1;
                                } else {
                                    edgeVectorX = 0;
                                    edgeVectorY = -1;
                                }
                            }
                            result.x += (troop._id % (building.width * 3) - 1) * edgeVectorX;
                            result.y += (troop._id % (building.width * 3) - 1) * edgeVectorY;
                        }
                    }
                });
                break;
            case res.Troop.name.archer:
                break;
            case res.Troop.name.giant:
                break;
            case res.Troop.name.flyingBomb:
                break;
        }
        return result;
    }
}));