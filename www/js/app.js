var session = {registros:[]};
var db = null;
var usuario_id = null;
var evento_id = null;
var servidor = "http://tayme.esy.es/aplicaciones/peticiones/";
var modificar = {};
(function(){
    
    var app = angular.module('starter', ['ionic','ngCordova','angular-md5']);
    
   
    app.config(function($stateProvider, $urlRouterProvider){
        $stateProvider.state('login',{
            url:'/login',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/login.html'
        });
        $stateProvider.state('bienvenida',{
            url:'/bienvenida',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/bienvenida.html'
        });
       $stateProvider.state('nuevo',{
            url:'/nuevo',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/nuevo.html'
        });
       $stateProvider.state('configuracion',{
            url:'/configuracion',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/configuracion.html'
        });
       $stateProvider.state('anteriores',{
            url:'/anteriores',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/anteriores.html'
        });
       $stateProvider.state('comenzar',{
            url:'/comenzar/:tipo',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/comenzar.html'
        });
       $stateProvider.state('universidad',{
            url:'/universidad/:acepto?/:id?',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/universidad.html'
        });
       $stateProvider.state('empresa',{
            url:'/empresa/:acepto?/:id?',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/empresa.html'
        });
       $stateProvider.state('terminos',{
            url:'/terminos/:tipo',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/terminos.html'
        });
       $stateProvider.state('completado',{
            url:'/completado/:tipo/:id',
            //abstract: true, 
            cache: false, 
            templateUrl:'./templates/completado.html'
        });
        $urlRouterProvider.otherwise('/login');
    });
    
    app.controller("LoginCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$state,$location,$cordovaSQLite,md5,$rootScope){
        $scope.$on('$ionicView.beforeEnter', function () {
            //$scope.doRefresh();
        });

        $rootScope.logout = function(){
          usuario_id=null;
          $state.go("login");
          ionic.Platform.exitApp();
        }
        $scope.isLogin=false;
        console.log($scope.isLogin)
        if (usuario_id) {
          $scope.isLogin=true;
        }else{
          $scope.isLogin=false;

        }
        $scope.titulo = "App Registro"; 
        $scope.usuario = "";
        $scope.contrasena = "";
        console.log(md5.createHash("16923509j"));
        $scope.cargarUsuarios = function(){
             $scope.show();
            $http.post(servidor+"cargar_usuarios.php",{action:'cargar'}).then(function(res){
              console.log(res)
              if (res.data.length) {

                $query = "DELETE FROM usuario";
                $cordovaSQLite.execute(db,$query,[]).then(function(s){
                  console.log(s)
                },function(e){
                  $scope.showAlert("Error","Error restaurando base de datos de Usuarios");
                })    
                var err = 0;
                for (var i = 0; i <res.data.length; i++) {
                  $query = "INSERT into usuario (id,usuario,contrasena) values (?,?,?)";

                  $cordovaSQLite.execute(db,$query,[res.data[i].id,res.data[i].email,res.data[i].contrasena]).then(function(s){
                    console.log(s)
                  },function(e){
                    err=1;
                    $scope.showAlert("Error","Error restaurando base de datos de Usuarios");
                  })                  
                }
                if (!err) {
                  $scope.showAlert("Correcto!","Base de datos de usuarios actualizada!");
                }
              }else{
                $scope.showAlert("Aviso","La base de datos de usuarios ha venido vacia");
              }
              $scope.hide();

            },function(res){
                console.log(res.data)
                $scope.showAlert("Error en Autenticación","No se puede establecer conexion con el servidor!");
                $scope.hide();
            });          
        }
        $scope.login = function(){
            $scope.show();
            $query = "SELECT * from usuario where usuario=? and contrasena=?";
            $cordovaSQLite.execute(db,$query,[$scope.usuario,md5.createHash($scope.contrasena)]).then(function(res){
                if(res.rows.length){
                    //$scope.showAlert("Bievenid@ a:","Usuario "+res.data.usuario);
                    session.usuario = res.rows.item(0);
                    usuario_id = res.rows.item(0).id;
                    $location.path('/bienvenida');
                }else{
                    $scope.showAlert("Error en Autenticación","Nombre de usuario o contraseña inválidos!");            
                }
                $scope.hide();
            },function(res){
                console.log(res.data)
                $scope.showAlert("Error en Autenticación","Nombre de usuario o contraseña inválidos!");
                $scope.hide();
            })
            /*$http.post("http://tayme.esy.es/aplicaciones/peticiones/login.php",
            {
                usuario:$scope.usuario,
                contrasena:$scope.contrasena
            }
            ).then(function(res){
                console.log(res.data)
                if(res.data.usuario){
                    //$scope.showAlert("Bievenid@ a:","Usuario "+res.data.usuario);
                    session.usuario = res.data;
                    $location.path('/bienvenida');
                }else{
                    $scope.showAlert("Error en Autenticación","Nombre de usuario o contraseña inválidos!");            
                }
                $scope.hide();

            },function(res){
                console.log(res.data)
                $scope.showAlert("Error en Autenticación","Nombre de usuario o contraseña inválidos!");
                $scope.hide();
            });*/
        }
         // An alert dialog
         $scope.showAlert = function(title,mgs) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: mgs
           });

           alertPopup.then(function(res) {
               console.log(res);
             console.log('Thank you for not eating my delicious ice cream cone');
           });
         };
          $scope.show = function() {
            $ionicLoading.show({
              template: 'Cargando...'
            }).then(function(){
               console.log("The loading indicator is now displayed");
            });
          };
          $scope.hide = function(){
            $ionicLoading.hide().then(function(){
               console.log("The loading indicator is now hidden");
            });
          };
    });
    app.controller("BienvenidaCtrl",function($scope, $location, $ionicHistory){
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.doRefresh();
        });
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
        $scope.logout = function(){

          ionic.Platform.exitApp();
        }
        modificar = null;
        // if(!session.usuario){
        //     $location.path('/login');
        // }
        $scope.titulo = "App Registro";
        //$scope.usuario = session.usuario.usuario;
    });
    app.controller("NuevoCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$location,$cordovaSQLite, $ionicHistory){
        /*if(!session.usuario){
            $location.path('/Nuevo');
        }*/
        if (!usuario_id) {
                 $ionicHistory.nextViewOptions({
            disableBack: true
        });
          $state.go("login");
        }
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.doRefresh();
        });
        $scope.evento = {
          nombre:'',
          fecha:'',
          ubicacion:''
        }
        evento_id=null;
        function get_by_nombre(nombre){
          query = "SELECT * from evento where nombre = ?";
          $cordovaSQLite.execute(db,query,[nombre]).then(function(res){
            if (res.rows.length) {
              console.log("Evento con id:"+res.rows.item(0).id);
              return res.rows.item(0).id;
            }
          },function(res){
            $scope.showAlert("Error",res);
          });
         /* for (var i = 0; i < session.registros.length; i++) {
            if (session.registros[i].nombre == nombre) {
              return i;
            }
          }*/
          return false;
        }

        $scope.$watch("evento.fecha", function(newValue, oldValue) {
          console.log("Nuevo valor de fecha:",newValue);
        });
        $scope.showAlert = function(title,mgs) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: mgs
           });

           alertPopup.then(function(res) {
               console.log(res);
             console.log('Thank you for not eating my delicious ice cream cone');
           });
         };
        $scope.pasa_form = false;
        $scope.preguntar = function(titulo,template){
           $ionicPopup.confirm({
             title: titulo,
             template: template
           }).then(function(res) {
               if(res) {
                  //nro_evento = get_by_nombre($scope.evento.nombre);
                  /*session.registros[nro_evento].ubicacion = $scope.evento.ubicacion;
                  session.registros[nro_evento].fecha = $scope.evento.fecha;
                  session.registros[nro_evento].tipo = $scope.evento.tipo;*/
                  if ($scope.pasa_form) {
                    $location.path("/comenzar/"+$scope.evento.tipo.toLowerCase());
                  }
               } else {
                evento_id = null;
                 console.log('You are not sure');
               }
           });
        }
        $scope.titulo = "Nuevo Evento";
        $scope.evento = {tipo:'',id:''}
        $scope.tipos = [
          {"id": "empresa","nombre":"Empresa"}, 
          {"id": "universidad","nombre":"Universidad"}
        ];
        $scope.newValue=function(v){
          console.log(v)
        }
        $scope.validar_form_evento = function(){
          if (!$scope.evento.nombre) {
            $scope.showAlert("Error de Validación","El campo Nombre de Evento no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.evento.fecha){
            $scope.showAlert("Error de Validación","El campo Fecha de Evento no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.evento.ubicacion){
            $scope.showAlert("Error de Validación","El campo Ubicación de Evento no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.evento.tipo){
            $scope.showAlert("Error de Validación","El evento debe ser empresa o universidad, por favor, eliga uno!");
            $scope.pasa_form= false;
          }else{
            $scope.pasa_form = true;
          }
          return $scope.pasa_form;
        }
        $scope.crear_evento = function(){
          if(!$scope.validar_form_evento()){
            return;
          }
          query = "SELECT * from evento where nombre = ?";

          $cordovaSQLite.execute(db,query,[$scope.evento.nombre]).then(function(res){
            if (res.rows.length) {
              $scope.preguntar('Aviso',"Se ha encontrado un evento con el nombre '"+$scope.evento.nombre+"', si acepta, puede usar para seguir agregando registros a nombre de ese evento, si no, no pasa nada!");
              console.log("Evento con id:"+res.rows.item(0).id);
              evento_id = res.rows.item(0).id;
              //return res.rows.item(0).id;
            }else{
              query = "INSERT INTO evento (nombre,fecha,ubicacion,tipo,usuario_id) values (?,?,?,?,?) ";
              console.log("La fecha:"+$scope.evento.fecha.toISOString().substring(0, 19).replace('T', ' '))
              $cordovaSQLite.execute(db,query,[$scope.evento.nombre,$scope.evento.fecha.toISOString().substring(0, 19).replace('T', ' '),$scope.evento.ubicacion,$scope.evento.tipo.toLowerCase(),usuario_id]).then(function(res){
                console.log(res)
                $scope.showAlert("Evento registrado!","Evento registrado correctamente!");
                evento_id= res.insertId;
                $location.path("/comenzar/"+$scope.evento.tipo.toLowerCase());
              },function(res){
                console.log(res)

                $scope.showAlert("Error",res.message);
              });
            }
          },function(res){
            console.log(res)
            $scope.showAlert("Error",res.message);
          });
          id = session.registros.length+1;
          
         /* nro_evento = get_by_nombre($scope.evento.nombre);
          console.log("")
          if (nro_evento >= 0 && nro_evento !== false) {
            $scope.preguntar('Aviso',"Se ha encontrado un evento con el nombre '"+$scope.evento.nombre+"', si acepta, se reescribe, si no, no pasa nada!");
          }else{
              $scope.evento.id = id;
              session.registros.push($scope.evento)
              if ($scope.pasa_form) {
                $location.path("/comenzar/"+$scope.evento.tipo.toLowerCase());
              }
          }
          
          console.log(session.registros)*/
        }
        //$scope.usuario = session.usuario.usuario;
    });
   
    app.controller("ConfiguracionCtrl",function($scope, $location, $cordovaSQLite, $ionicLoading, $http, $ionicHistory){
        // if(!session.usuario){
        //     $location.path('/configuracion');
        // }
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
          $scope.$on('$ionicView.beforeEnter', function () {
              $scope.doRefresh();
          });
          $scope.show = function() {
            $ionicLoading.show({
              template: 'Cargando...'
            }).then(function(){
               console.log("The loading indicator is now displayed");
            });
          };
          $scope.hide = function(){
            $ionicLoading.hide().then(function(){
               console.log("The loading indicator is now hidden");
            });
          };
        $scope.titulo = "Configuracion";
        $scope.subir_db = function(){
          $scope.show();
          eventos = [];
          //query = "SELECT usuario.id as id_usuario, usuario as nombre_usuario, empresa.id as id_empresa, empresa.nombre_completo, empresa.email as empresa_email, empresa.telefono as empresa_telefono, empresa.celular as empresa_celular, empresa.nombre_empresa, empresa.comentario, empresa.favorito, empresa.evento_id as id_evento_empresa, evento.id as id_evento, evento.nombre as nombre_evento, evento.ubicacion, evento.tipo as tipo_evento from evento inner join usuario on evento.usuario_id = usuario.id inner join empresa on empresa.evento_id = evento.id";
          query = "SELECT * FROM evento";

          $cordovaSQLite.execute(db,query,[]).then(function(ok){
            for (var i = 0; i < ok.rows.length; i++) {
              eventos.push(ok.rows.item(i));
            }

         
              $http.post(servidor+"subir_db.php",{action:'subir_eventos',evento:eventos}, { timeout: 5000 }).then(function(res){
                console.log(res)

              },function(res){
                  console.log(res.data)
                  $scope.showAlert("Error","Ocurrio un error subiendo la base de datos de eventos");
              });   


                empresa = [];
                query = "SELECT * FROM empresa";
                $cordovaSQLite.execute(db,query,[]).then(function(ok){
                console.log(ok);
                for (var i = 0; i < ok.rows.length; i++) {
                  empresa.push(ok.rows.item(i));
                }  

                $http.post(servidor+"subir_db.php",{action:'subir_empresas',evento:empresa}, { timeout: 5000 }).then(function(res){
                  console.log(res)

                },function(res){
                    console.log(res.data)
                    $scope.showAlert("Error","Ocurrio un error subiendo la base de datos de empresas");
                }); 



                universidad = [];
                query = "SELECT * FROM universidad";
                $cordovaSQLite.execute(db,query,[]).then(function(ok){
                  console.log(ok);
                  for (var i = 0; i < ok.rows.length; i++) {
                    universidad.push(ok.rows.item(i));
                  }

                  $http.post(servidor+"subir_db.php",{action:'subir_universidades',evento:universidad}, { timeout: 5000 }).then(function(res){
                    console.log(res)
                     $scope.hide();
                  },function(res){
                      console.log(res.data)
                      $scope.showAlert("Error","Ocurrio un error subiendo la base de datos de universidades");
                       $scope.hide();
                  }); 

                },function(err){console.log(err)});  



              },function(err){console.log(err)});




            },function(err){console.log(err)});


        



         
        }
        //$scope.usuario = session.usuario.usuario;
    });
    app.controller("ComenzarCtrl",function($scope, $location,$state, $ionicHistory){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.doRefresh();
        });
        $scope.tipo = $state.params.tipo;
        if ($scope.tipo == 'universidad') {
          $scope.titulo = "Registro Universidad";
        }else{
          $scope.titulo = "Registro ExpoEmpleo 16";
        }
    });
    app.controller("UniversidadCtrl",function($scope, $ionicPopup, $location,$state,$cordovaSQLite, $ionicHistory, $ionicHistory){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.doRefresh();
        });

        if (modificar && modificar.evento_id) {
          evento_id = modificar.evento_id
          console.log("cambiando el evento_id:",evento_id)
        }
        if (modificar && modificar.nombre_completo) {
            console.log("Va a modificar");
              $scope.universidad = {
                id:modificar.id,
                nombre_completo:modificar.nombre_completo,
                email:modificar.email,
                telefono:modificar.telefono,
                celular:modificar.celular,
                comentario:modificar.comentario,
                nombre_universidad:modificar.contrasena,
                favorite:modificar.favorite
              };
        }else{
          console.log("No va a modificar");
          modificar=null;
          $scope.universidad = {
            nombre_completo:'',
            email:'',
            telefono:'',
            celular:'',
            comentario:'',
            contrasena:''
          };
        }

        $scope.pasa_form= false;            
        $scope.showAlert = function(title,mgs) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: mgs
           });

           alertPopup.then(function(res) {
               console.log(res);
             console.log('Thank you for not eating my delicious ice cream cone');
           });
         };
        if (session.respaldo_registro_universidad) {   
          $scope.universidad = {
              nombre_completo:session.respaldo_registro_universidad.nombre_completo,
              email:session.respaldo_registro_universidad.email,
              telefono:session.respaldo_registro_universidad.telefono,
              celular:session.respaldo_registro_universidad.celular,
              comentario:session.respaldo_registro_universidad.comentario,
              contrasena:session.respaldo_registro_universidad.contrasena
            };
          //session.respaldo_registro_empresa = {};
        }
        $scope.validar_form_universidad = function(){
          if (session.respaldo_registro_universidad) {          
            $scope.universidad = {
                nombre_completo:session.respaldo_registro_universidad.nombre_completo,
                email:session.respaldo_registro_universidad.email,
                telefono:session.respaldo_registro_universidad.telefono,
                celular:session.respaldo_registro_universidad.celular,
                comentario:session.respaldo_registro_universidad.comentario,
                contrasena:session.respaldo_registro_universidad.contrasena
              };
            //session.respaldo_registro_empresa = {};
          }
          if (!$scope.universidad.nombre_completo) {
            $scope.showAlert("Error de Validación","El campo Nombre Completo no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.universidad.email){
            $scope.showAlert("Error de Validación","El campo Email no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.universidad.telefono){
            $scope.showAlert("Error de Validación","El campo Teléfono no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.universidad.celular){
            $scope.showAlert("Error de Validación","El campo celular no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.universidad.contrasena){
            $scope.showAlert("Error de Validación","El campo Contraseña de la Empresa no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.checkStatus){
            $scope.showAlert("Error de Términos y Condiciones","Debe aceptar los términos y condiciones!");
            $scope.pasa_form= false;            
          }else{
            $scope.pasa_form = true;
          }
          return $scope.pasa_form;
        }
        $scope.respaldar = function(){
          session.respaldo_registro_universidad = {
          
              nombre_completo:$scope.universidad.nombre_completo,
              email:$scope.universidad.email,
              telefono:$scope.universidad.telefono,
              celular:$scope.universidad.celular,
              comentario:$scope.universidad.comentario,
              contrasena:$scope.universidad.contrasena
            
          }

        }
        $scope.clickHandler = function(tipo){
          $scope.respaldar();
          $state.go('terminos',{tipo:'universidad'});
        }
        $scope.checkit = function(status){
          $scope.checkStatus=status;
          console.log($scope.checkStatus)
        }
        if ($state.params.acepto) {
          $scope.checkStatus=$state.params.acepto;
          console.log($scope.checkStatus)

        }else{
          $scope.checkStatus=false;

        }
        $scope.guardar = function(){
          if (usuario_id != null && evento_id != null) {
            if ($scope.universidad.id) {
              if (!$scope.validar_form_universidad()) {
                return;
              }              
              query = "UPDATE universidad set nombre_completo=?,email=?,telefono=?,celular=?,contrasena=?,comentario=?,favorito=?,evento_id=?, usuario=? where id=?";

              $cordovaSQLite.execute(db,query,[$scope.universidad.nombre_completo,$scope.universidad.email,$scope.universidad.telefono,$scope.universidad.celular,$scope.universidad.contrasena,$scope.universidad.comentario,$scope.favorite,evento_id,usuario_id,$scope.universidad.id]).then(function(ok){
                    if (ok.rowsAffected) {
                      $scope.pasa_form= true;
                      $scope.showAlert("Correcto","Registro editado correctamente!");
                      console.log($state.params);
                      modificar.id = $scope.universidad.id;
                      modificar.nombre_completo = $scope.universidad.nombre_completo;
                      modificar.email = $scope.universidad.email;
                      modificar.telefono = $scope.universidad.telefono;
                      modificar.celular = $scope.universidad.celular;
                      modificar.contrasena = $scope.universidad.contrasena;
                      modificar.comentario = $scope.universidad.comentario;
                      modificar.favorite = $scope.universidad.favorite;
                      modificar.evento_id = evento_id;
                     
                      $scope.universidad.nombre_completo="";
                      $scope.universidad.email="";
                      $scope.universidad.telefono="";
                      $scope.universidad.celular="";
                      $scope.universidad.nombre_universidad="";
                      $scope.universidad.comentario="";
                      $scope.universidad.favorito="";
                      $scope.favorite=false;
                      $state.go('completado',{tipo:'universidad',id:$scope.universidad.id});

                    }
                  },function(err){
                    console.log(err)
                    $scope.showAlert("Error",err.mgs);
                    $scope.pasa_form= false;  
                  });             
            }else{

              if (!$scope.validar_form_universidad()) {
                return;
              }
              query = "INSERT INTO universidad (nombre_completo,email,telefono,celular,contrasena,comentario,favorito,evento_id,usuario) values (?,?,?,?,?,?,?,?,?)";
        
              $cordovaSQLite.execute(db,query,[$scope.universidad.nombre_completo,$scope.universidad.email,$scope.universidad.telefono,$scope.universidad.celular,$scope.universidad.contrasena,$scope.universidad.comentario,$scope.universidad.favorite,evento_id,usuario_id]).then(function(ok){
                if (ok.insertId) {
                  $scope.pasa_form= true;
                  $scope.showAlert("Correcto","Registro insertado correctamente!");
                  console.log($state.params);
                  $scope.universidad.nombre_completo="";
                  $scope.universidad.email="";
                  $scope.universidad.telefono="";
                  $scope.universidad.celular="";
                  $scope.universidad.contrasena="";
                  $scope.universidad.comentario="";
                  $scope.universidad.favorito="";
                  $scope.favorite=false;
                  $ionicHistory.clearCache();
                  $location.path('/completado/universidad/'+ok.insertId);

                }
              },function(err){
                console.log(err)
                $scope.showAlert("Error",err.mgs);
                $scope.pasa_form= false;  
              });
            }
          }
        }
        $scope.tipo = 'universidad';
        
    });
    app.controller("EmpresaCtrl",function($scope, $ionicPopup, $location, $state, $cordovaSQLite, $ionicHistory){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.doRefresh();
        });
        //console.log("Evemto modificar=>",modificar.evento_id)
        if (modificar && modificar.evento_id) {
          evento_id = modificar.evento_id
          console.log("cambiando el evento_id:",evento_id)
        }else{
          $scope.checkStatus=false;
        }
        if (modificar && modificar.nombre_completo) {
            console.log("Va a modificar");
              $scope.empresa = {
                id:modificar.id,
                nombre_completo:modificar.nombre_completo,
                email:modificar.email,
                telefono:modificar.telefono,
                celular:modificar.celular,
                comentario:modificar.comentario,
                nombre_empresa:modificar.nombre_empresa,
                favorite:modificar.favorite
              };
        }else{
          console.log("No va a modificar");
          modificar=null;
          $scope.empresa = {
            nombre_completo:'',
            email:'',
            telefono:'',
            celular:'',
            comentario:'',
            nombre_empresa:''
          };
        }
        $scope.pasa_form= false;
        $scope.showAlert = function(title,mgs) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: mgs
           });

           alertPopup.then(function(res) {
               console.log(res);
             console.log('Thank you for not eating my delicious ice cream cone');
           });
         };
         console.log(session.respaldo_registro_empresa);
        if (session.respaldo_registro_empresa) {   
          $scope.empresa = {
              nombre_completo:session.respaldo_registro_empresa.nombre_completo,
              email:session.respaldo_registro_empresa.email,
              telefono:session.respaldo_registro_empresa.telefono,
              celular:session.respaldo_registro_empresa.celular,
              comentario:session.respaldo_registro_empresa.comentario,
              nombre_empresa:session.respaldo_registro_empresa.nombre_empresa
            };
          //session.respaldo_registro_empresa = {};
        }
        $scope.validar_form_empresa = function(){
        
          if (session.respaldo_registro_empresa) {          
            $scope.empresa = {
                nombre_completo:session.respaldo_registro_empresa.nombre_completo,
                email:session.respaldo_registro_empresa.email,
                telefono:session.respaldo_registro_empresa.telefono,
                celular:session.respaldo_registro_empresa.celular,
                comentario:session.respaldo_registro_empresa.comentario,
                nombre_empresa:session.respaldo_registro_empresa.nombre_empresa
              };
            //session.respaldo_registro_empresa = {};
          }
          if (!$scope.empresa.nombre_completo) {
            $scope.showAlert("Error de Validación","El campo Nombre Completo no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.empresa.email){
            $scope.showAlert("Error de Validación","El campo Email no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.empresa.telefono){
            $scope.showAlert("Error de Validación","El campo Teléfono no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.empresa.celular){
            $scope.showAlert("Error de Validación","El campo celular no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.empresa.nombre_empresa){
            $scope.showAlert("Error de Validación","El campo Nombre de la Empresa no puede ser nulo!");
            $scope.pasa_form= false;
          }else if(!$scope.checkStatus){
            $scope.showAlert("Error de Términos y Condiciones","Debe aceptar los términos y condiciones!");
            $scope.pasa_form= false;            
          }else{
            $scope.pasa_form = true;
          }
          return $scope.pasa_form;
        }
        $scope.respaldar = function(){
          session.respaldo_registro_empresa = {
          
              nombre_completo:$scope.empresa.nombre_completo,
              email:$scope.empresa.email,
              telefono:$scope.empresa.telefono,
              celular:$scope.empresa.celular,
              comentario:$scope.empresa.comentario,
              nombre_empresa:$scope.empresa.nombre_empresa
            
          }

        }
        $scope.clickHandler = function(tipo){
          $scope.respaldar();
          $state.go('terminos',{tipo:'empresa'});
        }
        $scope.checkit = function(status){
          $scope.checkStatus=status;
        }
         if ($state.params.acepto) {
          $scope.checkStatus=$state.params.acepto;
          console.log($scope.checkStatus)

        }else{
          $scope.checkStatus=false;

        }
        if ($scope.empresa.favorite) {
          $scope.favorite=true;
        }else{
          $scope.favorite=false;
        }
        $scope.guardar = function(){

          if (usuario_id != null && evento_id != null) {
            console.log("Valore de la empresa:",$scope.empresa)
            if ($scope.empresa.id) {
              if (!$scope.validar_form_empresa()) {
                return;
              }
              console.log("EDITANDO>>>")
              query = "UPDATE empresa set nombre_completo=?,email=?,telefono=?,celular=?,nombre_empresa=?,comentario=?,favorito=?,evento_id=?,usuario=? where id=?";
              $cordovaSQLite.execute(db,query,[$scope.empresa.nombre_completo,$scope.empresa.email,$scope.empresa.telefono,$scope.empresa.celular,$scope.empresa.nombre_empresa,$scope.empresa.comentario,$scope.favorite,evento_id,usuario_id,$scope.empresa.id]).then(function(ok){
                   console.log(ok)
                    if (ok.rowsAffected) {
                      $scope.pasa_form= true;
                      $scope.showAlert("Correcto","Registro editado correctamente!");
                      console.log($state.params);
                      modificar.id = $scope.empresa.id;
                      modificar.nombre_completo = $scope.empresa.nombre_completo;
                      modificar.email = $scope.empresa.email;
                      modificar.telefono = $scope.empresa.telefono;
                      modificar.celular = $scope.empresa.celular;
                      modificar.nombre_empresa = $scope.empresa.nombre_empresa;
                      modificar.comentario = $scope.empresa.comentario;
                      modificar.favorite = $scope.empresa.favorite;
                      modificar.evento_id = evento_id;
                     
                      $scope.empresa.nombre_completo="";
                      $scope.empresa.email="";
                      $scope.empresa.telefono="";
                      $scope.empresa.celular="";
                      $scope.empresa.nombre_empresa="";
                      $scope.empresa.comentario="";
                      $scope.empresa.favorito="";
                      $scope.favorite=false;
                      $state.go('completado',{tipo:'empresa',id:$scope.empresa.id});

                    }
                  },function(err){
                    console.log(err)
                    $scope.showAlert("Error",err.mgs);
                    $scope.pasa_form= false;  
                  });
                
            }else{

                if (!$scope.validar_form_empresa()) {
                  return;
                }
                  query = "INSERT INTO empresa (nombre_completo,email,telefono,celular,nombre_empresa,comentario,favorito,evento_id,usuario) values (?,?,?,?,?,?,?,?,?)";
                  $cordovaSQLite.execute(db,query,[$scope.empresa.nombre_completo,$scope.empresa.email,$scope.empresa.telefono,$scope.empresa.celular,$scope.empresa.nombre_empresa,$scope.empresa.comentario,$scope.favorite,evento_id,usuario_id]).then(function(ok){
                    if (ok.insertId) {
                      $scope.pasa_form= true;
                      $scope.showAlert("Correcto","Registro insertado correctamente!");
                      console.log($state.params);
                      $scope.empresa.nombre_completo="";
                      $scope.empresa.email="";
                      $scope.empresa.telefono="";
                      $scope.empresa.celular="";
                      $scope.empresa.nombre_empresa="";
                      $scope.empresa.comentario="";
                      $scope.empresa.favorito="";
                      $scope.favorite=false;
                      $location.path('/completado/empresa/'+ok.insertId);

                    }
                  },function(err){
                    console.log(err)
                    $scope.showAlert("Error",err.mgs);
                    $scope.pasa_form= false;  
                  });
            }
            
        }

        $scope.tipo = 'empresa';
        }
    });
    app.controller("TerminosCtrl",function($scope, $location,$state, $ionicHistory){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.doRefresh();
        });
        $scope.clickHandler = function(to,tipo){
          console.log(to,tipo)
          $state.go(to,{acepto:tipo});
        }      
        $scope.tipo = $state.params.tipo;
    });

    app.controller("CompletadoCtrl",function($scope, $location, $state, $cordovaSQLite,$rootScope, $ionicHistory){
      $scope.$on('$ionicView.beforeEnter', function () {
          $scope.doRefresh();
      });
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
      $scope.tipo = $state.params.tipo;
      $scope.id = $state.params.id;
        query = "SELECT * FROM "+$scope.tipo+" where id = ?";
        $cordovaSQLite.execute(db,query,[$scope.id]).then(function(ok){
          if (ok.rows.length) {
            //console.log('modificara',ok.rows.item(0));
            modificar=ok.rows.item(0);
            if (modificar.favorito) {
              modificar.favorito=true;
              modificar.favorite=true;
            }else{
              modificar.favorito=false;
              modificar.favorite=false;
            }
            //$location.path("/"+$scope.tipo+"/");
          }
        },function(err){console.log(err)});
        $scope.modificar=function(){
          $state.go($scope.tipo,modificar);
        }
         $scope.nuevo=function(a){
          console.log("recibiendo a:",a);

          modificar=null;
          $state.go(a,{},{location:'replace'});
         }
    });
    app.controller("AnterioresCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$location,$cordovaSQLite,$state, $ionicHistory){
      $scope.$on('$ionicView.beforeEnter', function () {
          $scope.doRefresh();
      });
        if (!usuario_id) {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          $state.go("login");
        }
      query = "SELECT * from evento";
      $scope.eventos = [];
      $cordovaSQLite.execute(db,query,[]).then(function(ok){
        for (var i = 0; i < ok.rows.length; i++) {
          $scope.eventos.push(ok.rows.item(i));
        }

      },function(err){});
      $scope.ir_evento = function(evento, tipo_evento){
        evento_id = evento;
        query = "SELECT * from evento where id = ? ";
        $cordovaSQLite.execute(db,query,[evento_id]).then(function(ok){
          if (ok.rows.length) {
            $state.go(ok.rows.item(0).tipo,{evento_id:evento});
          }
        },function(err){console.log(err)});
      }
      $scope.alfabetico = function(){
        query = "SELECT * from evento order by nombre asc";
        $scope.eventos = [];
        $cordovaSQLite.execute(db,query,[]).then(function(ok){
          for (var i = 0; i < ok.rows.length; i++) {
            $scope.eventos.push(ok.rows.item(i));
          }
        },function(err){});        
      }
      $scope.reciente = function(){
        query = "SELECT * from evento order by fecha desc";
        $scope.eventos = [];
        $cordovaSQLite.execute(db,query,[]).then(function(ok){
          console.log(ok)
          for (var i = 0; i < ok.rows.length; i++) {
            $scope.eventos.push(ok.rows.item(i));
          }
        },function(err){});          
      }
      $scope.showSelectValue=function(selected){
         query = "SELECT * from evento where fecha=?";
         $scope.eventos = [];
        $cordovaSQLite.execute(db,query,[selected.fecha]).then(function(ok){
          if (ok.rows.length) {
            for (var i = 0; i < ok.rows.length; i++) {
            
              $scope.eventos.push(ok.rows.item(i));
            }
          }
        },function(err){console.log(err)});    
      }
      $scope.showSelectValueNombre=function(selectedNombre){
         query = "SELECT * from evento where nombre=?";
         $scope.eventos = [];
        $cordovaSQLite.execute(db,query,[selectedNombre.nombre]).then(function(ok){
          if (ok.rows.length) {
            for (var i = 0; i < ok.rows.length; i++) {
            
              $scope.eventos.push(ok.rows.item(i));
            }
          }
        },function(err){console.log(err)});    
      }
         query = "SELECT * from evento order by fecha desc";
         $scope.fechas=[]
        $cordovaSQLite.execute(db,query,[]).then(function(ok){
          if (ok.rows.length) {
            console.log($scope.fechas);
            for (var i = 0; i < ok.rows.length; i++) {
              if (i==0) {
                $scope.selected=ok.rows.item(0);

              }
              $scope.fechas.push(ok.rows.item(i))
            }
          }
        },function(err){console.log(err)});     
         query = "SELECT * from evento  group by nombre order by nombre asc";
         $scope.nombres=[]
        $cordovaSQLite.execute(db,query,[]).then(function(ok){
          if (ok.rows.length) {
            console.log($scope.nombres);
            for (var i = 0; i < ok.rows.length; i++) {
              if (i==0) {
                $scope.selected=ok.rows.item(0);

              }
              $scope.nombres.push(ok.rows.item(i))
            }
          }
        },function(err){console.log(err)}); 
    })



    app.run(function($ionicPlatform,$cordovaSQLite) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

          db = $cordovaSQLite.openDB({ name: "my.db", iosDatabaseLocation:'default'});
        }else{
          db = window.openDatabase("my.db", "1.0", "Occ Mundial", 200000);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
        function borrar_todo(){
          $cordovaSQLite.execute(db,"DROP TABLE evento",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"DROP TABLE empresa",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"DROP TABLE universidad",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"DROP TABLE usuario",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
        }
        function ver_tablas(){
          $cordovaSQLite.execute(db,"SELECT * FROM evento LIMIT 1",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"SELECT * FROM empresa LIMIT 1",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"SELECT * FROM universidad LIMIT 1",[]).then(function(e){console.log(e)},function(e){ console.log(e)});
        }
        function registros_pruebas(){
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV','uni1@gmail.com','1111','2222','16923509','Comentario universidad','true','1','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV12','uni12@gmail.com','1111-2','22221','16923509-21','Comentario universidad 2','true','1','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV13','uni13@gmail.com','1111-3','22222','16923509-22','Comentario universidad 3','true','1','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV21','uni14@gmail.com','1111-4','22223','16923509-22','Comentario universidad 4','true','2','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV22','uni15@gmail.com','1111-5','22224','16923509-23','Comentario universidad 5','true','2','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV23','uni16@gmail.com','1111-6','22225','16923509-24','Comentario universidad 6','true','3','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO universidad (nombre_completo, email, telefono, celular, contrasena,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona UNIV24','uni17@gmail.com','1111-7','22226','16923509-25','Comentario universidad 7','true','3','15']).then(function(e){console.log(e)},function(e){ console.log(e)});

          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa','empresa1@gmail.com','1111','2222','16923509','Comentario empresa','true','4','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa12','empresa12@gmail.com','1111-2','22221','16923509-21','Comentario empresa 2','true','4','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa13','empresa13@gmail.com','1111-3','22222','16923509-22','Comentario empresa 3','true','4','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa21','empresa14@gmail.com','1111-4','22223','16923509-22','Comentario empresa 4','true','5','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa22','empresa15@gmail.com','1111-5','22224','16923509-23','Comentario empresa 5','true','5','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa23','empresa16@gmail.com','1111-6','22225','16923509-24','Comentario empresa 6','true','6','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO empresa (nombre_completo, email, telefono, celular, nombre_empresa,comentario, favorito,evento_id, usuario) values (?,?,?,?,?,?,?,?,?)",['Persona empresa24','empresa17@gmail.com','1111-7','22226','16923509-25','Comentario empresa 7','true','6','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          
          $cordovaSQLite.execute(db,"INSERT INTO evento (nombre, fecha, ubicacion, tipo, usuario_id) values (?,?,?,?,?)",['Evento 6','2016-08-01 15:16:30','Ubicacion evento 1','universidad','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO evento (nombre, fecha, ubicacion, tipo, usuario_id) values (?,?,?,?,?)",['Evento 5','2016-09-01 15:16:30','Ubicacion evento 2','universidad','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO evento (nombre, fecha, ubicacion, tipo, usuario_id) values (?,?,?,?,?)",['Evento 4','2016-10-01 15:16:30','Ubicacion evento 3','universidad','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO evento (nombre, fecha, ubicacion, tipo, usuario_id) values (?,?,?,?,?)",['Evento 3','2016-11-01 15:16:30','Ubicacion evento 4','empresa','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO evento (nombre, fecha, ubicacion, tipo, usuario_id) values (?,?,?,?,?)",['Evento 2','2016-12-01 15:16:30','Ubicacion evento 5','empresa','15']).then(function(e){console.log(e)},function(e){ console.log(e)});
          $cordovaSQLite.execute(db,"INSERT INTO evento (nombre, fecha, ubicacion, tipo, usuario_id) values (?,?,?,?,?)",['Evento 1','2016-01-01 15:16:30','Ubicacion evento 6','empresa','15']).then(function(e){console.log(e)},function(e){ console.log(e)});


        }
        //borrar_todo();
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS evento (id integer primary key, nombre text, fecha text, ubicacion text, tipo text, usuario_id integer)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS empresa (id integer primary key, nombre_completo text, email text, telefono text, celular text, nombre_empresa text,comentario text, favorito integer,evento_id integer, usuario integer)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS universidad (id integer primary key, nombre_completo text, email text, telefono text, celular text, contrasena text,comentario text, favorito integer,evento_id integer, usuario integer)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS usuario (id integer primary key, usuario text, contrasena text)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });     
        //ver_tablas();  
        //registros_pruebas();
      });
    })
}());
