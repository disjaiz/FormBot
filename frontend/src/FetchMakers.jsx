const url = "https://formbot-backend-vlhw.onrender.com";

//=============================== signup fetch ======================================
async function signup(formdata){

  try{
    const response = await fetch(`${url}/user/signup`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json', 
      },
    body: JSON.stringify(formdata),
    credentials: "include",
  });

  return response
  }
  catch (err) {
    console.log('Signup error:', err);
    throw err; 
  } 
}
export default signup;
// ===============================login fetch----------------------------------------------------------
async function login(formdata){
  
    try{
        const response = await fetch(`${url}/user/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
          },
        body: JSON.stringify(formdata),
        credentials: "include",
    });
      return response
    }

    catch (err) {
        console.log('Login error:', err);
        throw err;  
      }
    }
export {login}

// ===============================create workspace fetch----------------------------------------------------------
async function createWorkspace(){
  
    try{
        const response = await fetch(`${url}/workspace/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
          },
       
        credentials: "include",
    });
      return response
    }

    catch (err) {
        console.log('Create workspace error:', err);
        throw err;  
      }
    }
export {createWorkspace}

// ===============================find workspace fetch----------------------------------------------------------
async function findWorkspace(){
  
    try{
        const response = await fetch(`${url}/workspace/findWorkspace`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
          },
        // body: JSON.stringify(formdata),
        credentials: "include",
    });
      return response
    }

    catch (err) {
        console.log('Find workspace error:', err);
        throw err;  
      }
    }
export {findWorkspace}
//======================================delete a folder ================================

async function deleteFolder(folderId){
  console.log('entered deleteFolder')
    try{
      const response = await fetch(`${url}/workspace/deleteFolder`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ folderId }),
      });

      return response
    }catch (err) {
        console.log('Delete folder error:', err);
        throw err;  
      }
    }
export {deleteFolder}




