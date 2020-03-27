let levels = [
    { // level 0
        'backgroundImage': "src/image/streets.jpg",
        'gameRules': {
            'maxV': 1,
            'superMaxV': 3,
            'upgradeDuration': 300,
        },
        'environment': {
            'grass': [
                {"x1":21.333333333333332,"y1":5.333333333333333,"x2":278,"y2":26.666666666666668},
                {"x1":20.666666666666668,"y1":70.66666666666667,"x2":389.3333333333333,"y2":161.33333333333334},
                {"x1":254.66666666666666,"y1":162,"x2":390,"y2":180.66666666666666},
                {"x1":20,"y1":163.33333333333334,"x2":152.66666666666666,"y2":211.33333333333334},
                {"x1":20.666666666666668,"y1":213.33333333333334,"x2":53.333333333333336,"y2":250.66666666666666},
                {"x1":256.6666666666667,"y1":184,"x2":320.6666666666667,"y2":196.66666666666666},
                {"x1":360,"y1":182,"x2":389.3333333333333,"y2":196},
                {"x1":95.33333333333333,"y1":244,"x2":126.66666666666667,"y2":250},
                {"x1":232,"y1":230,"x2":385.3333333333333,"y2":246},
                {"x1":66,"y1":313.3333333333333,"x2":90,"y2":393.3333333333333},
                {"x1":16.666666666666668,"y1":394.6666666666667,"x2":76.66666666666667,"y2":414},
                {"x1":18.666666666666668,"y1":316,"x2":65.33333333333333,"y2":330},
                {"x1":90.66666666666667,"y1":315.3333333333333,"x2":274.6666666666667,"y2":368},
                {"x1":224.66666666666666,"y1":368.6666666666667,"x2":266,"y2":389.3333333333333},
                {"x1":120.66666666666667,"y1":402,"x2":186,"y2":419.3333333333333}
            ],
            'colliders': [
                //new ColliderCircle(100,100,20),
                //new ColliderCircle(110,110,20),
                //new ColliderCircle(120,120,20),
                new ColliderCircle(130,130,20),
                new ColliderRect(130,130,200,200),
            ]
            // collisions:
        }
    },
    { // level 1
        'backgroundImage': "src/image/square.png",
        'gameRules': {
            'maxV': 3,
            'superMaxV': 6,
            'upgradeDuration': 300,
        },
        'environment': {
            'grass': [],
            'colliders': [] 
        },
          
    }
];
