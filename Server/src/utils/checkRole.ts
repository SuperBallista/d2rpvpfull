import { BABAPK_ADMIN, MPK_ADMIN, ZPKE_ADMIN } from "src/config/constants"

export function giveAdmin(account):string[] {
    const admin = []
    if (BABAPK_ADMIN.includes(account))
      {admin.push("babapk")}          
     if (MPK_ADMIN.includes(account))
      {admin.push("mpk")}          
     if (ZPKE_ADMIN.includes(account))
      {admin.push("zpke")} 
  return admin
  }