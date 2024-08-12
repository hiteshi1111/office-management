const Permission = require("../schemas/permission.schema")

let service={}
service.defaultPermission= defaultPermission

async function defaultPermission(id){
    try{
      const permission = await Permission.create({
        userId:id
      })
      return permission;
    }catch(error){
      console.log("Error creating default permissions", error)
      return Promise.reject({error:"Error creating default permissions"})
    }
}

  // async function createPermission(){
  //   try {
  //     const permission = await Permission.create({
        
  //       sendMessageRequet:body.sendMessageRequet,
  //       addTasks:body.addTasks,
  //       addProject:body.addProject,
  //       addUser:body.addUser,
  //       addEvent:body.addEvent
  //     })
  //   } catch (error) {
  //     console.log("Error creating permission", error)
  //     return Promise.reject({error:"Error creating default permission"})
  //   }
  //   return permission
  // }
  module.exports = service