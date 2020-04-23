let levels = [
    { // level 0
        'backgroundImage': "src/image/streets.jpg",
        'gameRules': {},
        'environment': {}
    },
    { // level 1
        'backgroundImage': "src/image/square.png",
        'gameRules': {},
        'environment': {} 
    },
    { // level template
        'backgroundImage': 'src/image/paris.png',
        'gameRules': {},
        'environment': {"grass":[{"type":"grass","shape":"rect","x1":624.6650366748166,"y1":483.9652173913043,"x2":669.7310513447432,"y2":505.87826086956517},{"type":"grass","shape":"rect","x1":630.924205378973,"y1":525.9130434782609,"x2":661.5941320293398,"y2":718.1217391304348},{"type":"grass","shape":"rect","x1":635.3056234718827,"y1":452.66086956521735,"x2":662.2200488997555,"y2":289.25217391304346},{"type":"grass","shape":"rect","x1":544.5476772616137,"y1":284.8695652173913,"x2":620.9095354523228,"y2":401.9478260869565},{"type":"grass","shape":"rect","x1":680.3716381418092,"y1":293.0086956521739,"x2":747.9706601466993,"y2":419.4782608695652},{"type":"grass","shape":"rect","x1":702.9046454767725,"y1":254.8173913043478,"x2":755.4816625916869,"y2":198.4695652173913},{"type":"grass","shape":"rect","x1":757.359413202934,"y1":154.64347826086956,"x2":801.1735941320293,"y2":258.5739130434782},{"type":"grass","shape":"rect","x1":594.6210268948655,"y1":250.43478260869563,"x2":537.0366748166259,"y2":169.04347826086956},{"type":"grass","shape":"rect","x1":499.48166259168704,"y1":157.1478260869565,"x2":533.9070904645477,"y2":259.82608695652175},{"type":"grass","shape":"rect","x1":471.31540342298285,"y1":467.0608695652174,"x2":555.1882640586797,"y2":522.7826086956521},{"type":"grass","shape":"rect","x1":751.7261613691932,"y1":476.45217391304345,"x2":826.2102689486552,"y2":519.6521739130435}],"snow":[],"colliders":[{"type":"colliders","shape":"rect","x1":473.81907090464546,"y1":145.8782608695652,"x2":493.22249388753056,"y2":194.71304347826086},{"type":"colliders","shape":"rect","x1":470.6894865525672,"y1":208.48695652173913,"x2":498.8557457212714,"y2":272.3478260869565},{"type":"colliders","shape":"rect","x1":470.0635696821516,"y1":296.1391304347826,"x2":497.60391198044005,"y2":360},{"type":"colliders","shape":"rect","x1":469.4376528117359,"y1":377.53043478260867,"x2":500.7334963325183,"y2":455.79130434782604},{"type":"colliders","shape":"rect","x1":467.5599022004889,"y1":524.6608695652174,"x2":500.7334963325183,"y2":592.2782608695652},{"type":"colliders","shape":"rect","x1":518.2591687041564,"y1":555.9652173913043,"x2":538.2885085574572,"y2":589.7739130434783},{"type":"colliders","shape":"rect","x1":517.6332518337408,"y1":607.3043478260869,"x2":535.7848410757946,"y2":661.1478260869565},{"type":"colliders","shape":"rect","x1":465.05623471882643,"y1":604.8,"x2":497.60391198044005,"y2":661.1478260869565},{"type":"colliders","shape":"rect","x1":761.1149144254279,"y1":663.6521739130434,"x2":776.762836185819,"y2":604.1739130434783},{"type":"colliders","shape":"rect","x1":796.7921760391197,"y1":662.4,"x2":829.3398533007334,"y2":604.1739130434783},{"type":"colliders","shape":"rect","x1":798.044009779951,"y1":586.6434782608695,"x2":829.9657701711491,"y2":527.7913043478261},{"type":"colliders","shape":"rect","x1":762.3667481662592,"y1":586.0173913043478,"x2":778.0146699266503,"y2":561.5999999999999},{"type":"colliders","shape":"rect","x1":799.9217603911981,"y1":458.295652173913,"x2":833.0953545232273,"y2":383.16521739130434},{"type":"colliders","shape":"rect","x1":761.1149144254279,"y1":376.9043478260869,"x2":784.2738386308068,"y2":435.1304347826087},{"type":"colliders","shape":"rect","x1":535.158924205379,"y1":426.3652173913043,"x2":517.6332518337408,"y2":374.4},{"type":"colliders","shape":"rect","x1":538.2885085574572,"y1":351.23478260869564,"x2":520.7628361858191,"y2":294.2608695652174},{"type":"colliders","shape":"rect","x1":601.5061124694377,"y1":271.09565217391304,"x2":696.0195599022004,"y2":179.0608695652174},{"type":"colliders","shape":"rect","x1":762.3667481662592,"y1":294.88695652173914,"x2":782.3960880195598,"y2":358.7478260869565},{"type":"colliders","shape":"rect","x1":798.6699266503667,"y1":361.25217391304346,"x2":831.2176039119804,"y2":291.7565217391304},{"type":"colliders","shape":"rect","x1":806.1809290953545,"y1":266.0869565217391,"x2":834.3471882640586,"y2":214.7478260869565},{"type":"colliders","shape":"rect","x1":809.3105134474328,"y1":204.10434782608695,"x2":836.2249388753056,"y2":144.62608695652173}]}
    },
    { // level template
        'backgroundImage': 'src/image/farm.png',
        'gameRules': {},
        'environment': {"grass":[{"type":"grass","shape":"rect","x1":273.5256723716381,"y1":8.139130434782608,"x2":1127.9022004889976,"y2":197.2173913043478},{"type":"grass","shape":"rect","x1":270.3960880195599,"y1":126.46956521739129,"x2":178.38630806845964,"y2":3.7565217391304344},{"type":"grass","shape":"rect","x1":117.6723716381418,"y1":4.3826086956521735,"x2":0,"y2":714.991304347826},{"type":"grass","shape":"rect","x1":117.6723716381418,"y1":355.6173913043478,"x2":250.36674816625916,"y2":714.991304347826},{"type":"grass","shape":"rect","x1":145.2127139364303,"y1":351.86086956521734,"x2":98.26894865525671,"y2":201.6},{"type":"grass","shape":"rect","x1":248.4889975550122,"y1":405.0782608695652,"x2":291.0513447432763,"y2":715.6173913043477},{"type":"grass","shape":"rect","x1":300.44009779951097,"y1":710.6086956521739,"x2":454.4156479217604,"y2":566.6086956521739},{"type":"grass","shape":"rect","x1":345.5061124694376,"y1":448.2782608695652,"x2":248.4889975550122,"y2":711.8608695652174},{"type":"grass","shape":"circle","x":378.679706601467,"y":529.0434782608695,"r":47.31199561808043},{"type":"grass","shape":"circle","x":351.76528117359413,"y":576,"r":16.82070768109724},{"type":"grass","shape":"circle","x":311.080684596577,"y":463.30434782608694,"r":39.92767009324876},{"type":"grass","shape":"circle","x":287.921760391198,"y":439.51304347826084,"r":37.836665531909425},{"type":"grass","shape":"circle","x":249.11491442542786,"y":405.7043478260869,"r":26.741286796964534},{"type":"grass","shape":"circle","x":132.69437652811735,"y":373.7739130434782,"r":31.579702621876628},{"type":"grass","shape":"circle","x":132.0684596577017,"y":230.39999999999998,"r":21.03320438857954},{"type":"grass","shape":"circle","x":151.47188264058678,"y":260.45217391304345,"r":13.996687435998306},{"type":"grass","shape":"circle","x":148.9682151589242,"y":234.78260869565216,"r":7.138355377141396},{"type":"grass","shape":"circle","x":148.9682151589242,"y":247.30434782608694,"r":9.390385962705816},{"type":"grass","shape":"rect","x1":126.43520782396087,"y1":202.22608695652173,"x2":110.78728606356968,"y2":83.2695652173913},{"type":"grass","shape":"rect","x1":527.0220048899755,"y1":708.7304347826087,"x2":417.48655256723714,"y2":564.7304347826087},{"type":"grass","shape":"rect","x1":848.7432762836186,"y1":713.7391304347825,"x2":1276.8704156479216,"y2":551.5826086956521},{"type":"grass","shape":"rect","x1":1277.4963325183373,"y1":543.4434782608695,"x2":1076.5770171149145,"y2":446.4},{"type":"grass","shape":"circle","x":1109.124694376528,"y":586.0173913043478,"r":146.95669805786466},{"type":"grass","shape":"circle","x":1227.4229828850855,"y":477.0782608695652,"r":102.84867501907218},{"type":"grass","shape":"circle","x":1168.5867970660145,"y":515.2695652173912,"r":118.69308057732061},{"type":"grass","shape":"circle","x":1276.8704156479216,"y":385.04347826086956,"r":71.02158510906456},{"type":"grass","shape":"circle","x":970.7970660146699,"y":555.9652173913043,"r":56.23261864497443},{"type":"grass","shape":"circle","x":918.8459657701711,"y":572.8695652173913,"r":37.83666553190947},{"type":"grass","shape":"rect","x1":848.1173594132028,"y1":627.3391304347825,"x2":783.6479217603911,"y2":568.4869565217391},{"type":"grass","shape":"rect","x1":848.1173594132028,"y1":631.095652173913,"x2":762.3667481662592,"y2":604.1739130434783},{"type":"grass","shape":"rect","x1":747.9706601466993,"y1":471.44347826086954,"x2":942.0048899755501,"y2":199.09565217391304},{"type":"grass","shape":"rect","x1":976.4303178484107,"y1":448.9043478260869,"x2":933.8679706601466,"y2":179.68695652173912},{"type":"grass","shape":"rect","x1":978.3080684596578,"y1":379.4086956521739,"x2":1117.8875305623471,"y2":185.32173913043476},{"type":"grass","shape":"rect","x1":1278.122249388753,"y1":0,"x2":1118.5134474327629,"y2":266.71304347826083},{"type":"grass","shape":"circle","x":1136.6650366748165,"y":289.25217391304346,"r":76.87058468686875},{"type":"grass","shape":"circle","x":1211.7750611246943,"y":263.58260869565214,"r":38.6103766349476},{"type":"grass","shape":"circle","x":1054.6699266503667,"y":388.79999999999995,"r":23.996259308226776},{"type":"grass","shape":"rect","x1":744.8410757946209,"y1":408.2086956521739,"x2":352.3911980440098,"y2":192.83478260869563},{"type":"grass","shape":"rect","x1":354.2689486552567,"y1":270.4695652173913,"x2":276.6552567237164,"y2":184.69565217391303},{"type":"grass","shape":"rect","x1":276.6552567237164,"y1":266.71304347826083,"x2":216.56723716381416,"y2":207.86086956521737},{"type":"grass","shape":"rect","x1":206.5525672371638,"y1":169.04347826086956,"x2":163.99022004889974,"y2":3.7565217391304344},{"type":"grass","shape":"circle","x":524.518337408313,"y":423.23478260869564,"r":61.50220298076632},{"type":"grass","shape":"circle","x":449.40831295843515,"y":424.4869565217391,"r":45.66629844493368},{"type":"grass","shape":"circle","x":401.8386308068459,"y":385.66956521739127,"r":50.078248539020365},{"type":"grass","shape":"circle","x":732.3227383863081,"y":441.39130434782606,"r":53.86735643694681},{"type":"grass","shape":"circle","x":682.8753056234718,"y":410.0869565217391,"r":37.33334861350223},{"type":"grass","shape":"circle","x":787.403422982885,"y":485.2173913043478,"r":52.691749574658694},{"type":"grass","shape":"circle","x":848.1173594132028,"y":475.8260869565217,"r":44.566273888346984},{"type":"grass","shape":"circle","x":704.1564792176039,"y":551.5826086956521,"r":41.18752116648042},{"type":"grass","shape":"circle","x":736.0782396088019,"y":513.391304347826,"r":46.53098760651305},{"type":"grass","shape":"circle","x":680.9975550122249,"y":598.5391304347826,"r":13.281237825251607},{"type":"grass","shape":"circle","x":696.6454767726161,"y":599.1652173913043,"r":25.266343728665714},{"type":"grass","shape":"circle","x":652.8312958435208,"y":570.3652173913043,"r":19.037614659350574},{"type":"grass","shape":"circle","x":544.5476772616137,"y":505.87826086956517,"r":29.09754373242514},{"type":"grass","shape":"circle","x":582.1026894865525,"y":399.44347826086954,"r":41.84449595843132},{"type":"grass","shape":"circle","x":501.98533007334964,"y":473.94782608695647,"r":32.1779334622759},{"type":"grass","shape":"circle","x":469.4376528117359,"y":449.53043478260867,"r":39.04293494198364},{"type":"grass","shape":"circle","x":333.61369193154036,"y":366.8869565217391,"r":20.65525672371632},{"type":"grass","shape":"circle","x":350.51344743276286,"y":385.66956521739127,"r":13.996687435998254},{"type":"grass","shape":"circle","x":204.04889975550122,"y":223.51304347826087,"r":17.626365709845157},{"type":"grass","shape":"circle","x":191.53056234718824,"y":189.0782608695652,"r":21.428021550708067},{"type":"grass","shape":"circle","x":220.9486552567237,"y":245.42608695652171,"r":16.853959271696088},{"type":"grass","shape":"rect","x1":205.3007334963325,"y1":133.35652173913041,"x2":354.2689486552567,"y2":101.42608695652173},{"type":"grass","shape":"rect","x1":163.99022004889974,"y1":68.8695652173913,"x2":152.09779951100242,"y2":1.8782608695652172},{"type":"grass","shape":"circle","x":938.8753056234718,"y":441.39130434782606,"r":31.035581218037716},{"type":"grass","shape":"circle","x":893.1833740831295,"y":460.17391304347825,"r":25.487632291762345},{"type":"grass","shape":"circle","x":995.8337408312958,"y":510.8869565217391,"r":20.998454070834587},{"type":"grass","shape":"rect","x1":528.8997555012224,"y1":627.3391304347825,"x2":610.2689486552566,"y2":604.1739130434783},{"type":"grass","shape":"rect","x1":530.1515892420538,"y1":601.0434782608695,"x2":561.4474327628361,"y2":579.7565217391304},{"type":"grass","shape":"circle","x":413.1051344743276,"y":573.495652173913,"r":55.743208315397084},{"type":"grass","shape":"circle","x":351.13936430317847,"y":494.6086956521739,"r":31.946310052673816}],"snow":[],"colliders":[{"type":"colliders","shape":"rect","x1":148.9682151589242,"y1":276.10434782608695,"x2":345.5061124694376,"y2":294.2608695652174},{"type":"colliders","shape":"rect","x1":148.34229828850854,"y1":331.8260869565217,"x2":345.5061124694376,"y2":348.73043478260865},{"type":"colliders","shape":"rect","x1":210.30806845965768,"y1":139.61739130434782,"x2":272.8997555012225,"y2":207.23478260869564},{"type":"colliders","shape":"rect","x1":645.9462102689487,"y1":413.8434782608695,"x2":627.1687041564792,"y2":552.2086956521739},{"type":"colliders","shape":"rect","x1":645.9462102689487,"y1":469.5652173913043,"x2":682.2493887530562,"y2":524.0347826086957},{"type":"colliders","shape":"circle","x":676.6161369193154,"y":496.4869565217391,"r":27.434996890087863},{"type":"colliders","shape":"circle","x":620.9095354523228,"y":485.2173913043478,"r":54.11559051309624},{"type":"colliders","shape":"circle","x":635.9315403422983,"y":503.99999999999994,"r":50.03622441800693},{"type":"colliders","shape":"circle","x":657.2127139364303,"y":490.2260869565217,"r":38.48124499092274},{"type":"colliders","shape":"circle","x":632.80195599022,"y":458.92173913043473,"r":34.428795870576444},{"type":"colliders","shape":"rect","x1":533.2811735941319,"y1":634.2260869565217,"x2":845.6136919315403,"y2":658.0173913043478},{"type":"colliders","shape":"rect","x1":532.6552567237163,"y1":689.9478260869565,"x2":848.1173594132028,"y2":711.2347826086956},{"type":"colliders","shape":"circle","x":140.83129584352076,"y":38.81739130434782,"r":11.491056904698304},{"type":"colliders","shape":"circle","x":142.7090464547677,"y":69.49565217391304,"r":12.533984057174063},{"type":"colliders","shape":"circle","x":143.960880195599,"y":97.6695652173913,"r":11.283886288265418},{"type":"colliders","shape":"circle","x":138.95354523227383,"y":82.64347826086956,"r":2.2569640818021153},{"type":"colliders","shape":"rect","x1":126.43520782396087,"y1":0,"x2":148.9682151589242,"y2":83.2695652173913},{"type":"colliders","shape":"rect","x1":132.69437652811735,"y1":79.51304347826087,"x2":163.36430317848408,"y2":197.84347826086955},{"type":"colliders","shape":"circle","x":156.479217603912,"y":198.4695652173913,"r":8.352927127207723},{"type":"colliders","shape":"circle","x":157.10513447432763,"y":185.9478260869565,"r":16.527520822936832},{"type":"colliders","shape":"circle","x":165.8679706601467,"y":214.7478260869565,"r":12.658461018722095},{"type":"colliders","shape":"circle","x":181.51589242053788,"y":236.03478260869565,"r":13.483167417356853},{"type":"colliders","shape":"circle","x":168.99755501222492,"y":222.26086956521738,"r":13.541784490812741},{"type":"colliders","shape":"circle","x":192.1564792176039,"y":260.45217391304345,"r":15.281943835297666},{"type":"colliders","shape":"circle","x":269.1442542787286,"y":369.39130434782606,"r":15.154379716559783},{"type":"colliders","shape":"circle","x":279.158924205379,"y":366.8869565217391,"r":17.392230070674465},{"type":"colliders","shape":"circle","x":309.8288508557457,"y":388.17391304347825,"r":10.805089137995838},{"type":"colliders","shape":"circle","x":295.4327628361858,"y":380.03478260869565,"r":13.204706548110117},{"type":"colliders","shape":"circle","x":323.59902200489,"y":399.44347826086954,"r":11.643833307089272},{"type":"colliders","shape":"circle","x":338.6210268948655,"y":411.3391304347826,"r":11.146005530503071},{"type":"colliders","shape":"circle","x":354.89486552567234,"y":426.3652173913043,"r":11.760489765396745},{"type":"colliders","shape":"circle","x":373.0464547677261,"y":442.64347826086953,"r":14.066822262203988},{"type":"colliders","shape":"circle","x":359.90220048899755,"y":436.38260869565215,"r":11.074984345434705},{"type":"colliders","shape":"circle","x":345.5061124694376,"y":423.86086956521734,"r":12.024745579728247},{"type":"colliders","shape":"circle","x":396.2053789731051,"y":462.0521739130435,"r":17.028380487326128},{"type":"colliders","shape":"circle","x":426.8753056234719,"y":487.09565217391304,"r":15.549205600114309},{"type":"colliders","shape":"circle","x":411.85330073349627,"y":474.5739130434782,"r":16.526328965874352},{"type":"colliders","shape":"circle","x":452.5378973105134,"y":505.25217391304346,"r":18.674953571820108},{"type":"colliders","shape":"circle","x":488.21515892420535,"y":530.295652173913,"r":25.91582872544871},{"type":"colliders","shape":"rect","x1":984.5672371638141,"y1":383.79130434782604,"x2":1027.1295843520782,"y2":429.495652173913},{"type":"colliders","shape":"circle","x":508.87041564792173,"y":537.1826086956521,"r":21.265885790887605},{"type":"colliders","shape":"circle","x":532.6552567237163,"y":557.2173913043478,"r":16.274492883869424},{"type":"colliders","shape":"circle","x":552.0586797066014,"y":557.8434782608696,"r":16.154504569852023},{"type":"colliders","shape":"circle","x":569.5843520782396,"y":567.8608695652174,"r":14.878453835126274},{"type":"colliders","shape":"circle","x":588.9877750611246,"y":577.8782608695652,"r":20.039457467428083},{"type":"colliders","shape":"circle","x":610.8948655256723,"y":586.6434782608695,"r":15.126668542325866},{"type":"colliders","shape":"circle","x":630.924205378973,"y":605.4260869565217,"r":16.044045810259664},{"type":"colliders","shape":"circle","x":646.5721271393643,"y":617.9478260869565,"r":22.956213948886614},{"type":"colliders","shape":"circle","x":714.7970660146699,"y":622.9565217391304,"r":8.962193454838161},{"type":"colliders","shape":"circle","x":727.3154034229827,"y":626.0869565217391,"r":15.34471416620788},{"type":"colliders","shape":"circle","x":742.3374083129585,"y":607.3043478260869,"r":13.51188523012381},{"type":"colliders","shape":"circle","x":755.4816625916869,"y":583.5130434782608,"r":13.670511187239374},{"type":"colliders","shape":"circle","x":770.5036674816627,"y":564.104347826087,"r":15.153424154417806},{"type":"colliders","shape":"circle","x":788.6552567237163,"y":551.5826086956521,"r":13.279506064024146},{"type":"colliders","shape":"circle","x":801.1735941320293,"y":549.704347826087,"r":13.729173722160116},{"type":"colliders","shape":"circle","x":814.9437652811736,"y":544.695652173913,"r":13.204706548110089},{"type":"colliders","shape":"circle","x":829.9657701711491,"y":539.6869565217391,"r":10.11237556301768},{"type":"colliders","shape":"circle","x":834.3471882640586,"y":543.4434782608695,"r":18.410438897648696},{"type":"colliders","shape":"circle","x":856.2542787286063,"y":533.4260869565217,"r":14.65280333631869},{"type":"colliders","shape":"circle","x":871.9022004889974,"y":532.1739130434783,"r":18.610418581823097},{"type":"colliders","shape":"circle","x":890.0537897310513,"y":520.2782608695652,"r":17.221747844768835},{"type":"colliders","shape":"circle","x":912.5867970660147,"y":504.6260869565217,"r":21.181495053955082},{"type":"colliders","shape":"circle","x":943.882640586797,"y":489.59999999999997,"r":15.07588250928616},{"type":"colliders","shape":"circle","x":967.041564792176,"y":480.2086956521739,"r":13.996687435998306},{"type":"colliders","shape":"circle","x":209.68215158924204,"y":267.96521739130435,"r":10.931324046972628},{"type":"colliders","shape":"circle","x":374.29828850855745,"y":454.5391304347826,"r":14.068464677118618},{"type":"colliders","shape":"circle","x":182.76772616136918,"y":241.6695652173913,"r":17.18848299357489},{"type":"colliders","shape":"circle","x":980.8117359413202,"y":473.32173913043476,"r":16.044045810259643},{"type":"colliders","shape":"circle","x":997.0855745721271,"y":457.66956521739127,"r":18.055712654416922},{"type":"colliders","shape":"circle","x":1017.1149144254279,"y":448.2782608695652,"r":15.686409269904965},{"type":"colliders","shape":"circle","x":1033.3887530562347,"y":440.1391304347826,"r":17.638109299290832},{"type":"colliders","shape":"circle","x":1052.7921760391198,"y":433.25217391304346,"r":11.810677434102644},{"type":"colliders","shape":"circle","x":1067.1882640586796,"y":424.4869565217391,"r":17.35808969113721},{"type":"colliders","shape":"circle","x":1085.9657701711492,"y":413.2173913043478,"r":14.287719958086036},{"type":"colliders","shape":"circle","x":1103.4914425427874,"y":401.9478260869565,"r":14.192205069663771},{"type":"colliders","shape":"circle","x":1123.520782396088,"y":393.18260869565216,"r":13.206343307600914},{"type":"colliders","shape":"circle","x":1141.0464547677261,"y":388.79999999999995,"r":17.269152182457166},{"type":"colliders","shape":"circle","x":1162.9535452322737,"y":380.66086956521735,"r":17.7938392053477},{"type":"colliders","shape":"circle","x":1182.9828850855745,"y":361.87826086956517,"r":12.024745579728283},{"type":"colliders","shape":"circle","x":1183.6088019559902,"y":366.8869565217391,"r":10.769669713234677},{"type":"colliders","shape":"circle","x":1194.2493887530563,"y":357.495652173913,"r":12.153247478934341},{"type":"colliders","shape":"circle","x":1208.6454767726161,"y":341.2173913043478,"r":13.742628437912542},{"type":"colliders","shape":"circle","x":1221.7897310513447,"y":323.6869565217391,"r":12.42554337585929},{"type":"colliders","shape":"circle","x":1238.0635696821514,"y":307.4086956521739,"r":15.960220174816524},{"type":"colliders","shape":"circle","x":1258.0929095354522,"y":297.39130434782606,"r":11.07522469131062},{"type":"colliders","shape":"circle","x":1271.8630806845965,"y":289.25217391304346,"r":11.812083703204783},{"type":"colliders","shape":"circle","x":165.8679706601467,"y":189.70434782608694,"r":16.857275612365424},{"type":"colliders","shape":"circle","x":461.92665036674816,"y":520.2782608695652,"r":16.323193602771187},{"type":"colliders","shape":"circle","x":669.7310513447432,"y":623.5826086956521,"r":9.389671601066404}]}
    },
    { // level template
        'backgroundImage': 'src/image/bridge.png',
        'gameRules': {},
        'environment': {"grass":[{"type":"grass","shape":"rect","x1":0,"y1":541.5652173913043,"x2":1275.6185819070904,"y2":706.2260869565217},{"type":"grass","shape":"rect","x1":1270.6112469437653,"y1":529.6695652173913,"x2":1001.4669926650366,"y2":6.260869565217391},{"type":"grass","shape":"rect","x1":992.0782396088019,"y1":132.73043478260868,"x2":10.014669926650367,"y2":8.139130434782608},{"type":"grass","shape":"rect","x1":551.4327628361858,"y1":138.36521739130433,"x2":11.266503667481663,"y2":170.92173913043476},{"type":"grass","shape":"rect","x1":732.3227383863081,"y1":132.73043478260868,"x2":977.682151589242,"y2":172.79999999999998},{"type":"grass","shape":"rect","x1":283.5403422982885,"y1":179.0608695652174,"x2":7.511002444987775,"y2":532.8},{"type":"grass","shape":"rect","x1":300.44009779951097,"y1":498.3652173913043,"x2":553.9364303178484,"y2":534.0521739130435},{"type":"grass","shape":"rect","x1":729.1931540342298,"y1":495.86086956521734,"x2":1000.2151589242053,"y2":540.3130434782609}],"snow":[],"colliders":[{"type":"colliders","shape":"rect","x1":557.0660146699266,"y1":150.8869565217391,"x2":597.7506112469438,"y2":517.1478260869565},{"type":"colliders","shape":"rect","x1":684.1271393643032,"y1":150.26086956521738,"x2":722.9339853300733,"y2":519.6521739130435},{"type":"colliders","shape":"rect","x1":552.684596577017,"y1":478.9565217391304,"x2":306.69926650366745,"y2":183.44347826086954},{"type":"colliders","shape":"rect","x1":727.3154034229827,"y1":187.82608695652172,"x2":972.0488997555012,"y2":482.0869565217391}]}
    },
    { // level template
        'backgroundImage': 'src/image/pillars.png',
        'gameRules': {},
        'environment': {"grass":[],"snow":[],"colliders":[{"type":"colliders","shape":"circle","x":152.09779951100242,"y":142.12173913043478,"r":32.55369840745125},{"type":"colliders","shape":"circle","x":153.9755501222494,"y":242.29565217391303,"r":31.295843520782398},{"type":"colliders","shape":"circle","x":151.47188264058678,"y":358.1217391304348,"r":31.352155995584056},{"type":"colliders","shape":"circle","x":153.34963325183372,"y":477.0782608695652,"r":29.41809290953546},{"type":"colliders","shape":"circle","x":151.47188264058678,"y":576,"r":31.45201811657663},{"type":"colliders","shape":"circle","x":379.9315403422983,"y":574.7478260869565,"r":31.183251526839392},{"type":"colliders","shape":"circle","x":379.30562347188265,"y":475.8260869565217,"r":32.84141522689554},{"type":"colliders","shape":"circle","x":382.4352078239608,"y":358.7478260869565,"r":29.41809290953546},{"type":"colliders","shape":"circle","x":380.5574572127139,"y":242.92173913043476,"r":31.07621973269885},{"type":"colliders","shape":"circle","x":379.9315403422983,"y":142.7478260869565,"r":28.16625916870413},{"type":"colliders","shape":"circle","x":639.6870415647921,"y":142.12173913043478,"r":80.99566543949783},{"type":"colliders","shape":"circle","x":637.1833740831295,"y":363.7565217391304,"r":85.7528968262974},{"type":"colliders","shape":"circle","x":639.6870415647921,"y":577.2521739130434,"r":80.361618743384},{"type":"colliders","shape":"circle","x":911.960880195599,"y":577.8782608695652,"r":30.69547752108415},{"type":"colliders","shape":"circle","x":910.7090464547676,"y":475.8260869565217,"r":31.915956971238806},{"type":"colliders","shape":"circle","x":909.4572127139363,"y":360.6260869565217,"r":31.29584352078257},{"type":"colliders","shape":"circle","x":910.7090464547676,"y":241.6695652173913,"r":32.07488750410869},{"type":"colliders","shape":"circle","x":910.7090464547676,"y":142.12173913043478,"r":32.7637414026958},{"type":"colliders","shape":"circle","x":1137.2909535452322,"y":144.62608695652173,"r":31.295843520782228},{"type":"colliders","shape":"circle","x":1137.916870415648,"y":242.92173913043476,"r":29.742754570033856},{"type":"colliders","shape":"circle","x":1141.0464547677261,"y":358.1217391304348,"r":30.277945426239725},{"type":"colliders","shape":"circle","x":1141.0464547677261,"y":478.9565217391304,"r":29.65696623072939},{"type":"colliders","shape":"circle","x":1139.1687041564792,"y":577.2521739130434,"r":34.56746600718217}]}
    },
    { // level template
        'backgroundImage': 'src/image/blocks.png',
        'gameRules': {},
        'environment': {"grass":[],"snow":[],"colliders":[{"type":"colliders","shape":"rect","x1":122.05378973105134,"y1":41.32173913043478,"x2":194.6601466992665,"y2":85.14782608695651},{"type":"colliders","shape":"rect","x1":220.32273838630806,"y1":117.70434782608694,"x2":379.9315403422983,"y2":216},{"type":"colliders","shape":"rect","x1":414.98288508557454,"y1":242.29565217391303,"x2":613.3985330073349,"y2":348.10434782608695},{"type":"colliders","shape":"rect","x1":682.2493887530562,"y1":241.04347826086956,"x2":876.2836185819071,"y2":344.97391304347826},{"type":"colliders","shape":"rect","x1":915.0904645476771,"y1":212.86956521739128,"x2":1070.9437652811737,"y2":118.95652173913042},{"type":"colliders","shape":"rect","x1":1100.361858190709,"y1":83.2695652173913,"x2":1172.3422982885086,"y2":41.32173913043478},{"type":"colliders","shape":"rect","x1":611.520782396088,"y1":385.04347826086956,"x2":416.86063569682153,"y2":486.4695652173913},{"type":"colliders","shape":"rect","x1":376.80195599022005,"y1":517.1478260869565,"x2":224.07823960880194,"y2":612.3130434782609},{"type":"colliders","shape":"rect","x1":194.03422982885084,"y1":643.6173913043477,"x2":122.67970660146699,"y2":686.8173913043478},{"type":"colliders","shape":"rect","x1":682.2493887530562,"y1":383.79130434782604,"x2":876.9095354523228,"y2":489.59999999999997},{"type":"colliders","shape":"rect","x1":915.0904645476771,"y1":516.5217391304348,"x2":1071.5696821515892,"y2":611.0608695652173},{"type":"colliders","shape":"rect","x1":1099.1100244498778,"y1":645.495652173913,"x2":1172.3422982885086,"y2":688.695652173913}]}
    },
    { // level template
        'backgroundImage': 'src/image/',
        'gameRules': {},
        'environment': {}
    },
];
