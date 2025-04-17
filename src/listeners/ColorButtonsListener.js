const EventListener = require("../structures/EventListener")

class ColorButtonsListener extends EventListener {

    constructor () {
        super("interactionCreate")
    }

    async run (i) {
        if (i.message.id === "893193057128816690") {
            // Hard coded mesmo fodase
    
            let roleId;
            switch (i.customId) {
                case "Azul":
                    roleId = "890928281241649192"
                    break;
                case "Vermelho":
                    roleId = "890927972662542346"
                    break;
                case "Verde Escuro":
                    roleId = "890928410661118016"
                    break;
                case "Verde Água":
                    roleId = "890928747434369035"
                    break;
                case "Roxo":
                    roleId = "890928467347124234"
                    break;
                case "Roxo Claro":
                    roleId = "890928822990553139"
                    break;
                case "Laranja":
                    roleId = "890928510976295042"
                    break;
                case "Preto":
                    roleId = "892019662123053096"   
                    break;     
            }
    
            let colorRoles = ["890928281241649192", "890927972662542346", "890928410661118016", "890928747434369035", "890928467347124234", "890928822990553139", "890928510976295042", "892019662123053096"]
            let colorRolesThatMemberHas = i.member.roles.cache.filter(r => colorRoles.includes(r.id))
            colorRolesThatMemberHas.forEach(r => i.member.roles.remove(r))
    
            i.member.roles.add(roleId)
            i.reply({ content: "Cor alterada! Sua cor agora é **" + i.customId + "**!", ephemeral: true })
    
            return
        }
    }

}

module.exports = ColorButtonsListener