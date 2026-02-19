export const register = (email, password)  =>{

  const newUser = {email,password}
  localStorage.setItem('registered_users',JSON.stringify(newUser ));

}


export const login = (email,password)=>{
  
  const savedUser  = localStorage.getItem('registered_users');

  if(savedUser){
    const user = JSON.parse(savedUser);
    if(user.email===email && user.password ===password){

      localStorage.setItem('current_user', JSON.stringify({email}));
      return true;

    }

}

return false;
}



export const logout = () => {


  localStorage.removeItem('current_user');

}


export const isLoggedIn = () =>{


  const user = localStorage.getItem('current_user');

  return !!user;




}



export const getCurrentUser = () =>{

  const userStr = localStorage.getItem('current_user')

  if (userStr){


    return JSON.parse(userStr)

  }

  return null



  
}






























































/*export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// Yeni bir kullanıcıyı localStorage'a kaydeder.
export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));S
};

// Verilen e-posta ve şifre ile kullanıcıyı bulur.
export const findUser = (email, password) => {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password);
};

// Giriş yapan kullanıcıyı localStorage'a kaydeder.
export const setLoggedInUser = (user) => {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
};

// Mevcut giriş yapmış kullanıcıyı döndürür.
export const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

// Mevcut kullanıcının çıkış yapmasını sağlar.
export const logout = () => {
  localStorage.removeItem('loggedInUser');
};*/