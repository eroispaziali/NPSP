({
    doInit: function (component, event, helper) {
        var inputCmp = component.find('input');

        if (inputCmp) {
            inputCmp.addHandler('input', component, 'c.handleInputChange');
            inputCmp.addHandler('focus', component, 'c.handleInputFocus');
            inputCmp.addHandler('blur', component, 'c.handleInputBlur');
        }

        // This calls a function (callback) in a delayed manner and it can be
        // cancelled.
        var makeDelay = function () {
            var timer = 0;
            return function(callback, ms){
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        }

        component._delay = makeDelay(); // this one is for pausing before doing autocomplete
        component._focus = makeDelay(); // this one is to accumulate focus/blur events to determine if component has focus
    },

    handleInputChange: function (component, event, helper) {
        if (component._delay) {
            component._delay(
                $A.getCallback(function() {
                    if (component && component.isValid()) {
                        helper.handleInputChange(component, event);
                    }
                }),
                300
            );
        } else {
            helper.handleInputChange(component, event);
        }
    },

    handleInputFocus: function (component, event, helper) {
        var inputCmp = component.find('input');
        if ('' !== inputCmp.get('v.value')) {
            helper.setListVisibilityDelayed(component, true);
        }
    },

    handleInputBlur: function (component, event, helper) {
        helper.setListVisibilityDelayed(component, false);
    },

    handleListFocus: function (component, event, helper) {
        helper.setListVisibilityDelayed(component, true);
    },

    handleListBlur: function (component, event, helper) {
        helper.setListVisibilityDelayed(component, false);
    },

    handleOptionSelected: function (component, event, helper) {
        var valueSelected = event.getParam('value');
        component.set('v.value', valueSelected);
        component.set('v.displayValue', valueSelected);
        helper.setListVisibilityDelayed(component, false);
    },
    
    handleIsListVisibleChange: function (component, event, helper) {
        var isListVisible = component.get('v.isListVisible');
        helper.setListVisibilityDelayed(component, isListVisible);
    },

    handleRemovePill: function (component, event, helper) {
        component.set('v.value', '');
        component.set('v.displayValue', '');
        component.set('v.keyword', '');
    }
})