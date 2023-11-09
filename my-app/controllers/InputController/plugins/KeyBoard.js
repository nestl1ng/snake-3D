import { activityList } from './pluginSettings'
import { inputController } from "../InputController"

export class KeyBoard {
    enabled
    constructor() {
        this.btnsPressed = {};

        this.pressHandler = this.pressHandler.bind(this);
        this.wringHandler = this.wringHandler.bind(this);
        this.enabled = true;
    }

    attachPlugin() {
        document.addEventListener('keydown', this.pressHandler);
        document.addEventListener('keyup', this.wringHandler);
    }

    detachPlugin() {
        document.removeEventListener('keydown', this.pressHandler);
        document.removeEventListener('keyup', this.wringHandler);
    }

    pressHandler(props) {
        if(!this.isKeyPressed(props.keyCode)){
            this.btnsPressed[props.keyCode] = props.keyCode;
        }
        for (let activityList in inputController.actionsToBind) {
            if (inputController.actionsToBind[activityList].keys.includes(props.keyCode)) {
                if(!inputController.actionsToBind[activityList].active){
                    inputController.actionsToBind[activityList].active = true;
                    document.dispatchEvent(inputController.actionActivated);
                }
            }
        }
    }

    wringHandler(props) {
        delete this.btnsPressed[props.keyCode];
        for (let activityList in inputController.actionsToBind) {
            if (inputController.actionsToBind[activityList].keys.includes(props.keyCode)) {
                if(!inputController.checkBtnsPressed(activityList)){
                    inputController.actionsToBind[activityList].active = false;
                    document.dispatchEvent(inputController.actionDeactivated);
                }
            }
        }
    }

    isKeyPressed(keyCode) {
        return this.btnsPressed.hasOwnProperty(keyCode);
    }

    isActionActive(action) {
        if (activityList.hasOwnProperty(action)
            && activityList[action].enabled) {
            return activityList[action].keys.some((item) => this.isKeyPressed(item));
        } return false
    }

    checkAction(actionName){
        return inputController.actionsToBind[actionName].keys.some((item)=>this.isKeyPressed(item));
    }
}