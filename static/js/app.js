async function Clasificator(inputRaw,datavalue)
{
    const model = await tf.loadLayersModel('modelTrained/perfiles.json');
    const input=tf.tensor2d(inputRaw,[1,7]);
    const predictionWithArgMax=model.predict(input).argMax(-1).dataSync();
    CreateUser(datavalue,predictionWithArgMax[0])
}

function CreateUser(params, Clasificator) {
var domainname = 'http://localhost/moodle/';
    var token = 'ce13720bd9a10593c24c0850ca8481d8';
    var functionname = 'core_user_create_users';
    var serverurl = domainname + '/webservice/rest/server.php' ;
    
    //add params into data
    var userstocreate = [{ 
                            username: params.user,
                            password: params.password,
                            firstname: params.name,
                            lastname: params.lastname,
                            email: params.email,
                            auth: 'manual',
                            idnumber: 'testidnumber1',
                            lang: 'es',
                            timezone: 'Pacific/Port_Moresby',
                            mailformat: 0,
                            description: 'Curso Capacitación en Framework de Salud Sexual y Reproductiva',
                            city: 'Popayan',
                            country: 'Colombia',
                         }
                     ];
    var data = {
                wstoken: token,
                wsfunction: functionname,
                moodlewsrestformat: 'json',
                users: userstocreate
                }
    var response = $.ajax(
                            {   type: 'POST',
                                data: data,
                                url: serverurl
                            }
                         );
   
    response.then(data=>{
        
        RegistarUsu(data[0],Clasificator);
    })
    

} 
var variables=[];
var datavalue={}; 
var completado=false;
$(document).ready(function() {
   $('#enviar').click(function(){ 
       datavalue["name"]=$("#name").val();
       datavalue["user"]=$("#user").val();
       datavalue["lastname"]=$("#lastname").val();
       datavalue["password"]=$("#password").val();
       datavalue["email"]=$("#email").val();
       $('input').each(function(){
            if (this.checked) {
               datavalue[$(this).attr("name")]=$(this).val()
               variables.push(parseInt($(this).val()))
            }
      }); 
      
      if (datavalue != {}  && completado==false)
        {
            completado=true;
            Clasificator(variables,datavalue); 
        }   
      else
            alert('Debes seleccionar al menos una opción.');

      return false;
   });  
});


   //New Function
    function RegistarUsu(user, clasificar){

    var domainname = 'http://localhost/moodle/';
    var token = '29b7a963732a18bf169af548bbec7ad9';
    var functionname = 'enrol_manual_enrol_users';
    var serverurl = domainname + '/webservice/rest/server.php' ;

    var enrollUser = [{roleid: '1', userid:user.id , courseid :parseInt(clasificar.classification)+1}]
    console.log(enrollUser)
    var data = {
        wstoken: token,
        wsfunction: functionname,
        moodlewsrestformat: 'json',
        enrolments: enrollUser
    }
    var response = $.ajax(
                    {
                    type: 'POST',
                    data: data,
                    url: serverurl
                    }
                        );
    console.log(response);
    
}





