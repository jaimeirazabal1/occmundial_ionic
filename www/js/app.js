var session = {registros:[]};
(function(){
    
    var app = angular.module('starter', ['ionic']);
    
    
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
    
    app.controller("LoginCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$location){
        $scope.titulo = "App Registro"; 
        $scope.usuario = "";
        $scope.contrasena = "";
        $scope.login = function(){
            $scope.show();
            $http.post("http://tayme.esy.es/aplicaciones/peticiones/login.php",
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
            });
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
    app.controller("NuevoCtrl",function($scope,$ionicPopup, $timeout,$http,$ionicLoading,$location){
        /*if(!session.usuario){
            $location.path('/Nuevo');
        }*/
        function get_by_nombre(nombre){
          for (var i = 0; i < session.registros.length; i++) {
            if (session.registros[i].nombre == nombre) {
              return i;
            }
          }
          return false;
        }
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
                 $location.path("/comenzar/"+$scope.evento.tipo.toLowerCase());
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
        $scope.crear_evento = function(){
          id = session.registros.length+1;
          
          nro_evento = get_by_nombre($scope.evento.nombre);
          if (nro_evento >= 0 && nro_evento !== false) {
            $scope.preguntar('Aviso',"Se ha encontrado un evento con el nombre '"+$scope.evento.nombre+"', si acepta, se reescribe, si no, no pasa nada!");
          }else{
              $scope.evento.id = id;
              session.registros.push($scope.evento)
              $location.path("/comenzar/"+$scope.evento.tipo.toLowerCase());
          }
          
          console.log(session.registros)
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
    app.controller("UniversidadCtrl",function($scope, $location,$state){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        $scope.clickHandler = function(tipo){
          $state.go('terminos',{tipo:'universidad'});
        }
        $scope.checkit = function(status){
          $scope.checkStatus=status;
        }
        $scope.guardar = function(){
          console.log($scope.universidad)
        }
        if ($state.params.acepto) {
          $scope.checkStatus=$state.params.acepto;
        }
        $scope.tipo = 'universidad';
        
    });
    app.controller("EmpresaCtrl",function($scope, $location,$state){
        // if(!session.usuario){
        //     $location.path('/comenzar');
        // }
        $scope.clickHandler = function(tipo){
          $state.go('terminos',{tipo:'empresa'});
        }
        $scope.checkit = function(status){
          $scope.checkStatus=status;
        }
        $scope.guardar = function(){
          console.log($scope.empresa)
        }
        if ($state.params.acepto) {
          $scope.checkStatus=$state.params.acepto;
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






    app.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
}());
