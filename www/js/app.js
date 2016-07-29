var session = {registros:[]};
var db = null;
var usuario_id = null;
var evento_id = null;
(function(){
    
    var app = angular.module('starter', ['ionic','ngCordova','angular-md5']);
    
    
    app.config(function($stateProvider, $urlRouterProvider){
        $stateProvider.state('login',{
            url:'/login',
            templateUrl:'./templates/login.html'
        });
        $stateProvider.state('bienvenida',{
            url:'/bienvenida',
            templateUrl:'./templates/bienvenida.html'
        });
       $stateProvider.state('nuevo',{
            url:'/nuevo',
            templateUrl:'./templates/nuevo.html'
        });
       $stateProvider.state('configuracion',{
            url:'/configuracion',
            templateUrl:'./templates/configuracion.html'
        });
       $stateProvider.state('anteriores',{
            url:'/anteriores',
            templateUrl:'./templates/anteriores.html'
        });
       $stateProvider.state('comenzar',{
            url:'/comenzar/:tipo',
            templateUrl:'./templates/comenzar.html'
        });
       $stateProvider.state('universidad',{
            url:'/universidad/:acepto?',
            templateUrl:'./templates/universidad.html'
        });
       $stateProvider.state('empresa',{
            url:'/empresa/:acepto?',
            templateUrl:'./templates/empresa.html'
        });
       $stateProvider.state('terminos',{
            url:'/terminos/:tipo',
            templateUrl:'./templates/terminos.html'
        });
        $urlRouterProvider.otherwise('/login');
    });
    
    app.controller("LoginCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$location,$cordovaSQLite,md5){
        $scope.titulo = "App Registro"; 
        $scope.usuario = "";
        $scope.contrasena = "";
        console.log(md5.createHash("16923509j"));
        $scope.cargarUsuarios = function(){
             $scope.show();
            $http.post("http://tayme.esy.es/aplicaciones/peticiones/cargar_usuarios.php",{action:'cargar'}).then(function(res){
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
                $scope.showAlert("Error en Autenticación","Nombre de usuario o contraseña inválidos!");
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
    app.controller("BienvenidaCtrl",function($scope, $location){
        // if(!session.usuario){
        //     $location.path('/login');
        // }
        $scope.titulo = "App Registro";
        //$scope.usuario = session.usuario.usuario;
    });
    app.controller("NuevoCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$location,$cordovaSQLite){
        /*if(!session.usuario){
            $location.path('/Nuevo');
        }*/
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
                  nro_evento = get_by_nombre($scope.evento.nombre);
                  session.registros[nro_evento].ubicacion = $scope.evento.ubicacion;
                  session.registros[nro_evento].fecha = $scope.evento.fecha;
                  session.registros[nro_evento].tipo = $scope.evento.tipo;
                  if ($scope.pasa_form) {
                    $location.path("/comenzar/"+$scope.evento.tipo.toLowerCase());
                  }
               } else {
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
              $scope.preguntar('Aviso',"Se ha encontrado un evento con el nombre '"+$scope.evento.nombre+"', si acepta, se reescribe, si no, no pasa nada!");
              console.log("Evento con id:"+res.rows.item(0).id);
              return res.rows.item(0).id;
            }else{
              query = "INSERT INTO evento (nombre,fecha,ubicacion,tipo,usuario_id) values (?,?,?,?,?) ";
              $cordovaSQLite.execute(db,query,[$scope.evento.nombre,$scope.evento.fecha,$scope.evento.ubicacion,$scope.evento.tipo,usuario_id]).then(function(res){
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
    app.controller("AnterioresCtrl",function($scope, $location){
        // if(!session.usuario){
        //     $location.path('/anteriores');
        // }
        $scope.titulo = "Eventos Anteriores";
        //$scope.usuario = session.usuario.usuario;
    });
    app.controller("ConfiguracionCtrl",function($scope, $location){
        // if(!session.usuario){
        //     $location.path('/configuracion');
        // }
        $scope.titulo = "Configuracion";
        //$scope.usuario = session.usuario.usuario;
    });
    app.controller("ComenzarCtrl",function($scope, $location,$state){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        $scope.tipo = $state.params.tipo;
        if ($scope.tipo == 'universidad') {
          $scope.titulo = "Registro Universidad";
        }else{
          $scope.titulo = "Registro ExpoEmpleo 16";
        }
    });
    app.controller("UniversidadCtrl",function($scope, $ionicPopup, $location,$state){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
         $scope.universidad = {
          nombre_completo:'',
          email:'',
          telefono:'',
          celular:'',
          comentario:'',
          contrasena:''
        };
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
          if (!$scope.validar_form_universidad()) {
            return;
          }
          console.log($scope.universidad)
        }
        $scope.tipo = 'universidad';
        
    });
    app.controller("EmpresaCtrl",function($scope, $ionicPopup, $location,$state){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }

        $scope.empresa = {
          nombre_completo:'',
          email:'',
          telefono:'',
          celular:'',
          comentario:'',
          nombre_empresa:''
        };
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
         console.log(session.respaldo_registro_empresa)
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
        $scope.guardar = function(){
          if (!$scope.validar_form_empresa()) {
            return;
          }
          console.log($scope.empresa)
        }
        $scope.tipo = 'empresa';
        
    });
    app.controller("TerminosCtrl",function($scope, $location,$state){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        $scope.clickHandler = function(to,tipo){
          console.log(to,tipo)
          $state.go(to,{acepto:tipo});
        }      
        $scope.tipo = $state.params.tipo;
    });






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
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS evento (id integer primary key, nombre text, fecha text, ubicacion text, tipo text, usuario_id integer)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS empresa (id integer primary key, nombre_completo text, email text, telefono text, celular text, nombre_empresa text,comentario text, favorito integer)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS universidad (id integer primary key, nombre_completo text, email text, telefono text, celular text, contrasena text,comentario text, favorito integer)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS usuario (id integer primary key, usuario text, contrasena text)").then(function(r){
          console.log(r)
        },function(e){
          console.log(e)
        });        
      });
    })
}());
