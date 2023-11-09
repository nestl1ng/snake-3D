import { activityList } from './plugins/pluginSettings'

class InputController {
    enabled;
    focused;
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    actionsToBind;
    target;
    btnsPressed;

    constructor(actionsToBind) {
        this.actionsToBind = actionsToBind;

        this.targe;
        this.plugins = [];
        this.enabled = false;
        this.actionActivated = new Event(this.ACTION_ACTIVATED);
        this.actionDeactivated = new Event(this.ACTION_DEACTIVATED);
    }

    isActionActive(actionName) {
        if (typeof this.actionsToBind[actionName] !== 'undefined') {
            if (this.enabled && this.actionsToBind[actionName].enabled) {
                return this.actionsToBind[actionName].active;
            } return false
        }
    }


    bindActions(actionsToBind) {
        this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind);
    }

    enableAction(actionName) {
        if (!this.enabled) {
            this.actionsToBind[actionName].enabled = true;
        }
    }

    disableAction(actionName) {
        if (this.enabled) {
            this.actionsToBind[actionName].enabled = false;
        }
    }

    attach(target, dontEnable) {
        if (dontEnable) {
            this.enabled = false;
            this.target = null;
        } else {
            this.enabled = true;
            this.target = target;
            this.plugins.forEach((plugin) => {
                plugin.attachPlugin();
            })
        }
    }

    detach() {
        this.target = null;
        this.enabled = false;
        this.plugins.forEach((plugin) => {
            plugin.detachPlugin();
        })
    }

    checkBtnsPressed(actionName){
        return this.plugins.some((plugin)=>plugin.checkAction(actionName));
    }

    //--------------------------------------------------------------------

    pluginsAdd() {
        this.plugins.push(...arguments);
    }

    setTarget(target) {
        this.target = target;
    }

}
export const inputController = new InputController(activityList);