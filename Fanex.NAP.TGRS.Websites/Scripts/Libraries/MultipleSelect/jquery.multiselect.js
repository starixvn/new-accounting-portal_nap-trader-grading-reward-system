(function ($, undefined) {

    var multiselectID = 0;
    var rEscape = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;

    $.widget("ech.multiselect", {

        // default options
        options: {
            header: true,
            height: 175,
            minWidth: 225,
            classes: '',
            checkAllText: 'Check all',
            uncheckAllText: 'Uncheck all',
            noneSelectedText: 'Select options',
            allSelectedText: null,
            selectedText: '# selected',
            selectedList: 0,
            show: null,
            hide: null,
            autoOpen: false,
            multiple: true,
            groupsCollapsable: false,           // (true | false) Determines if option groups can be collapsed.
            optGroupChecked: false,              // (true | false)  Displays input type checkbox in groups.
            position: {}
        },

        _create: function () {
            var el = this.element.hide(),
                o = this.options;

            this.speed = $.fx.speeds._default; // default speed for effects
            this._isOpen = false; // assume no

            var
                button = (this.button = $('<button type="button"><span class="ui-icon ui-icon-triangle-1-s"></span></button>'))
                    .addClass('ui-multiselect ui-widget ui-state-default')
                    .addClass(o.classes)
                    .attr({ 'title': el.attr('title'), 'aria-haspopup': true, 'tabIndex': el.attr('tabIndex') })
                    .insertAfter(el),

                buttonlabel = (this.buttonlabel = $('<span />'))
                    .html(o.noneSelectedText)
                    .appendTo(button),

                menu = (this.menu = $('<div />'))
                    .addClass('ui-multiselect-menu ui-dialog ui-front ui-widget ui-widget-content ui-corner-all')
                    .addClass(o.classes)
                    .appendTo(document.body),

                header = (this.header = $('<div />'))
                    .addClass('ui-widget-header ui-multiselect-header ui-helper-clearfix')
                    .appendTo(menu),

                headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
                    .addClass('ui-helper-reset')
                    .html(function () {
                        if (o.header === true) {
                            return '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + o.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + o.uncheckAllText + '</span></a></li>';
                        } else if (typeof o.header === "string") {
                            return '<li>' + o.header + '</li>';
                        } else {
                            return '';
                        }
                    })
                    //.append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>')
                    .appendTo(header),

                checkboxContainer = (this.checkboxContainer = $('<ul />'))
                    .addClass('ui-multiselect-checkboxes ui-helper-reset')
                    .appendTo(menu);

            // perform event bindings
            this._bindEvents();

            // build menu
            this.refresh(true);

            // some addl. logic for single selects
            if (!o.multiple) {
                menu.addClass('ui-multiselect-single');
            }
        },

        _init: function () {
            if (this.options.header === false) {
                this.header.hide();
            }
            if (!this.options.multiple) {
                this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').hide();
            }
            if (this.options.autoOpen) {
                this.open();
            }
            if (this.element.is(':disabled')) {
                this.disable();
            }
        },

        refresh: function (init) {
            function makeOptionGroup(self, groupNode, optionInGroupList) {
                var htmlGroup = '';               
                var optLabel = groupNode.getAttribute('label');                
                var checked = groupNode.getAttribute('checked') === "True" ? 'checked="true"' : '';
                var ariaSelected = groupNode.getAttribute('checked') === "True" ? 'aria-selected="true"' : 'aria-selected="false"';

                htmlGroup += '<li class="ui-multiselect-optgroup">';                
                htmlGroup += '<span class="ui-multiselect-grouplabel ui-multiselect-selectable optgroup-span">';
                htmlGroup += '<input class="optgroup-input" type="checkbox" name="multiselect_group" ' + checked + ' ' + ariaSelected + ' />';
                htmlGroup += '<span class="optgroup-title">' + optLabel + '</span>';
                htmlGroup += '</span>';
                if (self.options.groupsCollapsable) {
                    htmlGroup += '<button title="Expand" class="ui-multiselect-collapser"><span class="ui-icon-expand"></span></button>';
                }
                htmlGroup += '<ul>';
                $(optionInGroupList).each(function (optIndex, optEle) {
                    htmlGroup += makeOption(optIndex, optEle, true);
                });
                htmlGroup += '</ul>';
                htmlGroup += '</li>';

                return htmlGroup;
            }

            function makeOption(index, node, isOptGroup) {
                var htmlOption = '';
                var title = node.innerHTML,
                    description = node.title,
                    value = node.value,
                    inputID = 'ui-multiselect-' + (node.id || id + '-option-' + index),
                    isDisabled = node.disabled,
                    isSelected = node.selected,                    
                    labelClasses = ['ui-corner-all'],
                    liClasses = (isDisabled ? 'ui-multiselect-disabled ' : ' ') + node.className;

                if (isDisabled) {
                    labelClasses.push('ui-state-disabled');
                }

                // browsers automatically select the first option
                // by default with single selects
                if (isSelected && !o.multiple) {
                    labelClasses.push('ui-state-active');
                }

                htmlOption += '<li class="' + liClasses + '">';

                // create the label
                htmlOption += '<label for="' + inputID + '" title="' + description + '" class="' + labelClasses.join(' ') + '">';
                htmlOption += '<input id="' + inputID + '" name="multiselect_' + id + '" type="' + (o.multiple ? "checkbox" : "radio") + '" value="' + value + '" title="' + title + '"';

                // pre-selected?
                if (isSelected) {
                    htmlOption += ' checked="checked"';
                    htmlOption += ' aria-selected="true"';
                }

                // disabled?
                if (isDisabled) {
                    htmlOption += ' disabled="disabled"';
                    htmlOption += ' aria-disabled="true"';
                }

                // add the title and close everything off
                classOption = isOptGroup ? "option-in-group" : "option";
                htmlOption += ' /><span class="' + classOption +'">' + title + '</span></label></li>';

                return htmlOption;
            }

            var el = this.element,
                o = this.options,
                menu = this.menu,
                checkboxContainer = this.checkboxContainer,
                optgroups = [],
                html = "",
                id = el.attr('id') || multiselectID++; // unique ID for the label & option tags
            var self = this;            

            // build items
            el.find('option').each(function (optIndex) {
                var option = this;
                var parent = this.parentNode;
                var optLabel;

                // is this an optgroup?
                if (parent.tagName === 'OPTGROUP') {
                    optLabel = parent.getAttribute('label');

                    // has this optgroup been added already?
                    if ($.inArray(optLabel, optgroups) === -1) {
                        var optionInGroupList = $(parent).find('option');

                        html += makeOptionGroup(self, parent, optionInGroupList);
                        optgroups.push(optLabel);
                    }
                } else {
                    html += makeOption(optIndex, option, false);
                }
            });            

            // insert into the DOM
            checkboxContainer.html(html);

            // cache some moar useful elements
            this.labels = menu.find('label');
            this.inputs = this.labels.children('input');

            // set widths
            this._setButtonWidth();
            this._setMenuWidth();

            // remember default value
            this.button[0].defaultValue = this.update();

            // broadcast refresh event; useful for widgets
            if (!init) {
                this._trigger('refresh');
            }
        },

        // updates the button text. call refresh() to rebuild
        update: function () {
            var o = this.options,
                $inputs = this.inputs,
                $checked = $inputs.filter(':checked'),
                numChecked = $checked.length,
                value;

            if (numChecked === 0) {
                value = o.noneSelectedText;
            } else {
                if ($.isFunction(o.selectedText)) {
                    value = o.selectedText.call(this, numChecked, $inputs.length, $checked.get());
                } else if (/\d/.test(o.selectedList) && o.selectedList > 0 && numChecked <= o.selectedList) {
                    value = $checked.map(function () { return $(this).next().html(); }).get().join(', ');
                } else if (numChecked === $inputs.length && o.allSelectedText) {
                    value = o.allSelectedText;
                } else {
                    value = o.selectedText.replace('#', numChecked).replace('#', $inputs.length);
                }
            }

            this.buttonlabel.html(value);
            return value;
        },

        // binds events
        _bindEvents: function () {
            var self = this, button = this.button;

            function clickHandler() {
                self[self._isOpen ? 'close' : 'open']();
                return false;
            }

            // webkit doesn't like it when you click on the span :(
            button
                .find('span')
                .bind('click.multiselect', clickHandler);

            // button events
            button.bind({
                click: clickHandler,
                keypress: function (e) {
                    switch (e.which) {
                        case 27: // esc
                        case 38: // up
                        case 37: // left
                            self.close();
                            break;
                        case 39: // right
                        case 40: // down
                            self.open();
                            break;
                    }
                },
                mouseenter: function () {
                    if (!button.hasClass('ui-state-disabled')) {
                        $(this).addClass('ui-state-hover');
                    }
                },
                mouseleave: function () {
                    $(this).removeClass('ui-state-hover');
                },
                focus: function () {
                    if (!button.hasClass('ui-state-disabled')) {
                        $(this).addClass('ui-state-focus');
                    }
                },
                blur: function () {
                    $(this).removeClass('ui-state-focus');
                }
            });

            // header links
            this.header
                .delegate('a', 'click.multiselect', function (e) {
                    // close link
                    if ($(this).hasClass('ui-multiselect-close')) {
                        self.close();

                        // check all / uncheck all
                    } else {
                        self[$(this).hasClass('ui-multiselect-all') ? 'checkAll' : 'uncheckAll']();
                    }

                    e.preventDefault();
                });
       
            // optgroup label toggle support
            this.menu
                .delegate('li.ui-multiselect-optgroup span.optgroup-title', 'click.multiselect', function (e) {
                    var $input = $(this).parent().find('input.optgroup-input');                    
                    var checked = $input.attr('checked') === "true" || $input.attr('checked') === 'checked';
                    
                    $input.focus();
                    $input.attr('checked', !checked);
                    $input.attr('aria-selected', !checked);

                    if ($input.hasClass('optgroup-input'))
                        $optgroupInputs = $input.parent().parent().find('input:not(.optgroup-input)');
                    else
                        $optgroupInputs = $input.parent().parent().find('input');

                    var tags = self.element.find('option');
                    // gather an array of the values that actually changed
                    var inputValues = {};
                    $optgroupInputs.each(function () {
                        inputValues[this.value] = true;
                    });

                    // change state on the original option tags
                    tags.each(function () {
                        if (inputValues[this.value])
                            this.selected = !checked;
                        else if (!self.options.multiple)
                            this.selected = false;
                    });

                    var flag = $optgroupInputs.filter(':checked').length !== $optgroupInputs.length;

                    $optgroupInputs.each(self._toggleState('checked', flag));
                    self.update();
                    self.element.trigger("change");

                    setTimeout($.proxy(self.update, self), 10);
                })
                .delegate('li.ui-multiselect-optgroup input.optgroup-input', 'click.multiselect', function (e) {          
                    if (self.options.optGroupChecked) {
                        var $this = $(this);
                        var checked = this.checked;
                        $this.focus();
                        $this.attr('aria-selected', checked);

                        if ($this.hasClass('optgroup-input'))
                            $inputs = $this.parent().parent().find('input:not(.optgroup-input)');
                        else
                            $inputs = $this.parent().parent().find('input');

                        var tags = self.element.find('option');
                        // gather an array of the values that actually changed
                        var inputValues = {};
                        $inputs.each(function () {
                            inputValues[this.value] = true;
                        });

                        // change state on the original option tags
                        tags.each(function () {
                            if (inputValues[this.value])
                                this.selected = checked;
                            else if (!self.options.multiple)
                                this.selected = false;
                        });

                        var flag = $inputs.filter(':checked').length !== $inputs.length;

                        $inputs.each(self._toggleState('checked', flag));
                        self.update();
                        self.element.trigger("change");

                        setTimeout($.proxy(self.update, self), 10);
                    }                    
                })
                .delegate('li.ui-multiselect-optgroup-label a', 'click.multiselect', function (e) {
                    e.preventDefault();

                    var $this = $(this),
                        $inputs = $this.parent().nextUntil('li.ui-multiselect-optgroup-label').find('input:visible:not(:disabled)'),
                        nodes = $inputs.get(),
                        label = $this.parent().text();

                    // trigger event and bail if the return is false
                    if (self._trigger('beforeoptgrouptoggle', e, { inputs: nodes, label: label }) === false) {
                        return;
                    }                    

                    // toggle inputs
                    self._toggleChecked(
                        $inputs.filter(':checked').length !== $inputs.length,
                        $inputs
                    );

                    self._trigger('optgrouptoggle', e, {
                        inputs: nodes,
                        label: label,
                        checked: nodes[0].checked
                    });
                })
                .delegate('label', 'mouseenter.multiselect', function () {
                    if (!$(this).hasClass('ui-state-disabled')) {
                        self.labels.removeClass('ui-state-hover');
                        $(this).addClass('ui-state-hover').find('input').focus();
                    }
                })
                .delegate('label', 'keydown.multiselect', function (e) {
                    e.preventDefault();

                    switch (e.which) {
                        case 9: // tab
                        case 27: // esc
                            self.close();
                            break;
                        case 38: // up
                        case 40: // down
                        case 37: // left
                        case 39: // right
                            self._traverse(e.which, this);
                            break;
                        case 13: // enter
                            $(this).find('input')[0].click();
                            break;
                    }
                })                 
                .delegate('ul li label span.option-in-group', 'click.multiselect', function (e) {
                    if (self.options.optGroupChecked) {
                        e.preventDefault();

                        var $input = $(this).parent().find('input');
                        var val = $input.val();
                        var tags = self.element.find('option');
                        var checked = $input.attr('aria-selected') === "true";

                        $input.attr('checked', !checked);
                        $input.attr('aria-selected', !checked);

                        // change state on the original option tags
                        tags.each(function () {
                            if (this.value === val)
                                this.selected = !checked;
                            else if (!self.options.multiple)
                                this.selected = false;
                        });

                        $input.focus();
                        self.element.trigger("change");
                        setTimeout($.proxy(self.update, self), 10);

                        var $ul = $input.parent().parent().parent();
                        var $inputInUL = $ul.find('input');
                        isCheckAll = $inputInUL.filter(':checked').length === $inputInUL.length;

                        var $inputOptGroup = $ul.parent().find('span input');

                        $inputOptGroup.each(self._toggleState('checked', isCheckAll));
                    }                    
                })
                .delegate('ul li label input[type="checkbox"]', 'click.multiselect', function (e) {
                    if (self.options.optGroupChecked) {
                        var $input = $(this);
                        var val = $input.val();
                        var tags = self.element.find('option');
                        var checked = $input.attr('aria-selected') === "true";

                        // change state on the original option tags
                        tags.each(function () {
                            if (this.value === val)
                                this.selected = !checked;
                            else if (!self.options.multiple)
                                this.selected = false;
                        });

                        $input.focus();
                        self.element.trigger("change");
                        setTimeout($.proxy(self.update, self), 10);

                        var $ul = $input.parent().parent().parent();
                        var $inputInUL = $ul.find('input');
                        isCheckAll = $inputInUL.filter(':checked').length === $inputInUL.length;

                        var $inputOptGroup = $ul.parent().find('span input');

                        $inputOptGroup.each(self._toggleState('checked', isCheckAll));
                    }                    
                })
                .delegate('ul li label', 'click.multiselect', function (e) {
                    if (self.options.optGroupChecked) {
                        var $target = $(e.target);
                        if (!$target.is('input') && !$target.is('span')) {
                            var $span = $target.find('span.option-in-group');
                            if ($span.length > 0) {
                                $span.trigger('click');
                                e.preventDefault();
                            }
                        }
                    }
                })
                .delegate('input[type="checkbox"], input[type="radio"]', 'click.multiselect', function (e) {
                    if (self.options.optGroupChecked) {
                        return;
                    }

                    var $this = $(this),
                        val = this.value,
                        checked = this.checked,
                        tags = self.element.find('option');
                 
                    // bail if this input is disabled or the event is cancelled
                    if (this.disabled || self._trigger('click', e, { value: val, text: this.title, checked: checked }) === false) {
                        e.preventDefault();
                        return;
                    }                   

                    // make sure the input has focus. otherwise, the esc key
                    // won't close the menu after clicking an item.
                    $this.focus();

                    // toggle aria state
                    $this.attr('aria-selected', checked);

                    // change state on the original option tags
                    tags.each(function () {
                        if (this.value === val) {
                            this.selected = checked;
                        } else if (!self.options.multiple) {
                            this.selected = false;
                        }
                    });

                    // some additional single select-specific logic
                    if (!self.options.multiple) {
                        self.labels.removeClass('ui-state-active');
                        $this.closest('label').toggleClass('ui-state-active', checked);

                        // close menu
                        self.close();
                    }

                    // fire change on the select box
                    self.element.trigger("change");

                    // setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
                    // http://bugs.jquery.com/ticket/3827
                    setTimeout($.proxy(self.update, self), 10);

                    if (self.options.optGroupChecked) {
                        var $ul = $this.parent().parent().parent();
                        var $inputInUL = $ul.find('input');
                        isCheckAll = $inputInUL.filter(':checked').length === $inputInUL.length;

                        var $inputOptGroup = $ul.parent().find('span input');

                        $inputOptGroup.each(self._toggleState('checked', isCheckAll));                        
                    }
                })                
                .delegate('.ui-multiselect-collapser', 'click.multiselect', function (e) {
                    if (self.options.optGroupChecked) {
                        var $this = $(this),
                            $parent = $this.parent(),
                            collapsedClass = 'ui-multiselect-collapsed',
                            isCollapsed = $parent.hasClass(collapsedClass);

                        $parent.toggleClass(collapsedClass);

                        $this.attr('title', isCollapsed ? "Collapse" : "Expand")
                            .html(isCollapsed ? "<span class='ui-icon-expand'></span>" : "<span class='ui-icon-collapse'></span>");

                        if (!self.options.listbox) {
                            $parent.find('li').each(function (_, liEle) {
                                if (!isCollapsed)
                                    $(liEle).addClass('hide');
                                else
                                    $(liEle).removeClass('hide');
                            });
                        }
                    }                   
                });

            // close each widget when clicking on any other element/anywhere else on the page
            $(document).bind('mousedown.multiselect', function (e) {
                if (self._isOpen && !$.contains(self.menu[0], e.target) && !$.contains(self.button[0], e.target) && e.target !== self.button[0]) {
                    self.close();
                }
            });

            // deal with form resets.  the problem here is that buttons aren't
            // restored to their defaultValue prop on form reset, and the reset
            // handler fires before the form is actually reset.  delaying it a bit
            // gives the form inputs time to clear.
            $(this.element[0].form).bind('reset.multiselect', function () {
                setTimeout($.proxy(self.refresh, self), 10);
            });            
        },        

        // set button width
        _setButtonWidth: function () {
            var width = this.element.outerWidth(),
                o = this.options;

            if (/\d/.test(o.minWidth) && width < o.minWidth) {
                width = o.minWidth;
            }

            // set widths
            this.button.width(width);
        },

        // set menu width
        _setMenuWidth: function () {
            var m = this.menu,
                width = this.button.outerWidth() -
                    parseInt(m.css('padding-left'), 10) -
                    parseInt(m.css('padding-right'), 10) -
                    parseInt(m.css('border-right-width'), 10) -
                    parseInt(m.css('border-left-width'), 10);

            m.width(width || this.button.outerWidth());
        },
        
        // move up or down within the menu
        _traverse: function (which, start) {
            var $start = $(start),
                moveToLast = which === 38 || which === 37,

                // select the first li that isn't an optgroup label / disabled
                $next = $start.parent()[moveToLast ? 'prevAll' : 'nextAll']('li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)')[moveToLast ? 'last' : 'first']();

            // if at the first/last element
            if (!$next.length) {
                var $container = this.menu.find('ul').last();

                // move to the first/last
                this.menu.find('label')[moveToLast ? 'last' : 'first']().trigger('mouseover');

                // set scroll position
                $container.scrollTop(moveToLast ? $container.height() : 0);

            } else {
                $next.find('label').trigger('mouseover');
            }
        },

        // This is an internal function to toggle the checked property and
        // other related attributes of a checkbox.
        //
        // The context of this function should be a checkbox; do not proxy it.
        _toggleState: function (prop, flag) {
            return function () {
                if (!this.disabled) {
                    this[prop] = flag;
                }

                if (flag) {
                    this.setAttribute('aria-selected', true);
                } else {
                    this.removeAttribute('aria-selected');
                }
            };
        },

        _toggleChecked: function (flag, group) {
            var $inputs = (group && group.length) ? group : this.inputs,
                self = this;

            // toggle state on inputs
            $inputs.each(this._toggleState('checked', flag));

            // give the first input focus
            $inputs.eq(0).focus();

            // update button text
            this.update();

            // gather an array of the values that actually changed
            var inputValues = {};
            $inputs.each(function () {
                inputValues[this.value] = true;
            });

            // toggle state on original option tags
            this.element
                .find('option')
                .each(function () {
                    if (!this.disabled && inputValues[this.value]) {
                        self._toggleState('selected', flag).call(this);
                    }
                });
           
            // trigger the change event on the select
            if ($inputs.length) {
                this.element.trigger("change");
            }
        },

        // Toggle check OptGroup
        _toggleOptGroup: function (isChecked) {
            var optGroups = this.menu.find(".ui-multiselect-optgroup");
            var optGroupInputs = $(optGroups).find('input.optgroup-input');
            optGroupInputs.each(function (_, group) {
                $(group).prop('aria-selected', isChecked);
                $(group).prop('checked', isChecked);
            });
            this.element.trigger("change");
        },

        _toggleDisabled: function (flag) {
            this.button
                .attr({ 'disabled': flag, 'aria-disabled': flag })[flag ? 'addClass' : 'removeClass']('ui-state-disabled');

            var inputs = this.menu.find('input');
            var key = "ech-multiselect-disabled";

            if (flag) {
                // remember which elements this widget disabled (not pre-disabled)
                // elements, so that they can be restored if the widget is re-enabled.
                inputs = inputs.filter(':enabled')
                    .data(key, true);
            } else {
                inputs = inputs.filter(function () {
                    return $.data(this, key) === true;
                }).removeData(key);
            }

            inputs
                .attr({ 'disabled': flag, 'arial-disabled': flag })
                .parent()[flag ? 'addClass' : 'removeClass']('ui-state-disabled');

            this.element
                .attr({ 'disabled': flag, 'aria-disabled': flag });
        },

        // open the menu
        open: function (e) {
            var self = this,
                button = this.button,
                menu = this.menu,
                speed = this.speed,
                o = this.options,
                args = [];

            // bail if the multiselectopen event returns false, this widget is disabled, or is already open
            if (this._trigger('beforeopen') === false || button.hasClass('ui-state-disabled') || this._isOpen) {
                return;
            }

            var $container = menu.find('ul').last(),
                effect = o.show,
                pos = button.offset();

            if (o.optGroupChecked) 
                $container = $(menu).find('.ui-multiselect-checkboxes');

            // set the scroll of the checkbox container
            $container.scrollTop(0).height(o.height);

            // figure out opening effects/speeds
            if ($.isArray(o.show)) {
                effect = o.show[0];
                speed = o.show[1] || self.speed;
            }

            // if there's an effect, assume jQuery UI is in use
            // build the arguments to pass to show()
            if (effect) {
                args = [effect, speed];
            }

            // position and show menu
            if ($.ui.position && !$.isEmptyObject(o.position)) {
                o.position.of = o.position.of || button;

                menu
                    .show()
                    .position(o.position)
                    .hide();

                // if position utility is not available...
            } else {
                menu.css({
                    top: pos.top + button.outerHeight(),
                    left: pos.left
                });
            }

            // show the menu, maybe with a speed/effect combo
            $.fn.show.apply(menu, args);

            // select the first option
            // triggering both mouseover and mouseover because 1.4.2+ has a bug where triggering mouseover
            // will actually trigger mouseenter.  the mouseenter trigger is there for when it's eventually fixed
            this.labels.eq(0).trigger('mouseover').trigger('mouseenter').find('input').trigger('focus');

            button.addClass('ui-state-active');
            this._isOpen = true;
            this._trigger('open');
        },

        // close the menu
        close: function () {
            if (this._trigger('beforeclose') === false) {
                return;
            }

            var o = this.options,
                effect = o.hide,
                speed = this.speed,
                args = [];

            // figure out opening effects/speeds
            if ($.isArray(o.hide)) {
                effect = o.hide[0];
                speed = o.hide[1] || this.speed;
            }

            if (effect) {
                args = [effect, speed];
            }

            $.fn.hide.apply(this.menu, args);
            this.button.removeClass('ui-state-active').trigger('blur').trigger('mouseleave');
            this._isOpen = false;
            this._trigger('close');
        },

        enable: function () {
            this._toggleDisabled(false);
        },

        disable: function () {
            this._toggleDisabled(true);
        },

        checkAll: function (e) {
            this._toggleChecked(true);

            if (this.options.optGroupChecked) 
                this._toggleOptGroup(true);

            this._trigger('checkAll');
        },

        uncheckAll: function () {
            this._toggleChecked(false);

            if (this.options.optGroupChecked)
                this._toggleOptGroup(false);

            this._trigger('uncheckAll');
        },

        getChecked: function () {
            return this.menu.find('input').filter(':checked');
        },

        destroy: function () {
            // remove classes + data
            $.Widget.prototype.destroy.call(this);

            this.button.remove();
            this.menu.remove();
            this.element.show();

            return this;
        },

        isOpen: function () {
            return this._isOpen;
        },

        widget: function () {
            return this.menu;
        },

        getButton: function () {
            return this.button;
        },

        // react to option changes after initialization
        _setOption: function (key, value) {
            var menu = this.menu;

            switch (key) {
                case 'header':
                    menu.find('div.ui-multiselect-header')[value ? 'show' : 'hide']();
                    break;
                case 'checkAllText':
                    menu.find('a.ui-multiselect-all span').eq(-1).text(value);
                    break;
                case 'uncheckAllText':
                    menu.find('a.ui-multiselect-none span').eq(-1).text(value);
                    break;
                case 'height':                   
                    menu.find('ul').last().height(parseInt(value, 10));
                    break;
                case 'minWidth':
                    this.options[key] = parseInt(value, 10);
                    this._setButtonWidth();
                    this._setMenuWidth();
                    break;
                case 'selectedText':
                case 'selectedList':
                case 'noneSelectedText':
                    this.options[key] = value; // these all needs to update immediately for the update() call
                    this.update();
                    break;
                case 'classes':
                    menu.add(this.button).removeClass(this.options.classes).addClass(value);
                    break;
                case 'multiple':
                    menu.toggleClass('ui-multiselect-single', !value);
                    this.options.multiple = value;
                    this.element[0].multiple = value;
                    this.refresh();
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        }
    });

    $.widget('ech.multiselectfilter', {

        options: {
            label: 'Filter:',
            width: null, /* override default width set in css file (px). null will inherit */
            placeholder: 'Enter keywords',
            autoReset: false
        },

        _create: function () {
            var self = this;
            var opts = this.options;
            var elem = $(this.element);

            // get the multiselect instance
            var instance = (this.instance = (elem.data('echMultiselect') || elem.data("multiselect") || elem.data("ech-multiselect")));

            // store header; add filter class so the close/check all/uncheck all links can be positioned correctly
            var header = (this.header = instance.menu.find('.ui-multiselect-header').addClass('ui-multiselect-hasfilter'));

            // wrapper elem
            // var wrapper = (this.wrapper = $('<div class="ui-multiselect-filter">' + (opts.label.length ? opts.label : '') + '<input placeholder="' + opts.placeholder + '" type="text"' + (/\d/.test(opts.width) ? 'style="width:' + opts.width + 'px"' : '') + ' /></div>').prependTo(this.header));
            var wrapper = this.wrapper = $('<div class="ui-multiselect-filter">' + (opts.label.length ? opts.label : '') +
                '<input placeholder="' + opts.placeholder + '" type="text"' + (/\d/.test(opts.width) ? 'style="width:' + opts.width + 'px"' : '') + ' />' +
                '<span class="ui-icon ui-icon-close disabled" style="left: ' + (/\d/.test(opts.width) ? opts.width + 40 : 140) + 'px"></span>' +
                '</div>');

            this.wrapper.prependTo(this.header);

            // reference to the actual inputs
            this.inputs = instance.menu.find('input[type="checkbox"], input[type="radio"]');

            // build the input box
            this.input = wrapper.find('input').bind({
                keydown: function (e) {
                    // prevent the enter key from submitting the form / closing the widget
                    if (e.which === 13) {
                        e.preventDefault();
                    }
                },
                keyup: $.proxy(self._handler, self),
                click: $.proxy(this._handler, this),
                focus: function () {
                    if (self.input.val().length > 0) {
                        self.span.removeClass('disabled');
                    }
                }
            }).bind('keyup', function () {
                if (self.input.val().length > 0) {
                    self.span.removeClass('disabled');
                } else {
                    self.span.addClass('disabled');
                }
            });

            // build the clear field icon
            this.span = wrapper.find('span').bind({
                click: function () {
                    if (self.input.val().length > 0) {
                        self.input.val('').keyup().focus();
                        self.span.addClass('disabled');
                    }
                }
            });

            // cache input values for searching
            this.updateCache();

            // rewrite internal _toggleChecked fn so that when checkAll/uncheckAll is fired,
            // only the currently filtered elements are checked
            instance._toggleChecked = function (flag, group) {
                var $inputs = (group && group.length) ? group : this.labels.find('input');
                var _self = this;
                
                // do not include hidden elems if the menu isn't open.
                var selector = instance._isOpen ? ':disabled, :hidden' : ':disabled';

                if (_self.options.optGroupChecked) {
                    selector = ':disabled';
                }                

                $inputs = $inputs
                    .not(selector)
                    .each(this._toggleState('checked', flag));

                // update text
                this.update();

                // gather an array of the values that actually changed
                var values = $inputs.map(function () {
                    return this.value;
                }).get();

                // select option tags
                this.element.find('option').filter(function () {
                    if (!this.disabled && $.inArray(this.value, values) > -1) {
                        _self._toggleState('selected', flag).call(this);
                    }
                });

                // trigger the change event on the select
                if ($inputs.length) {
                    this.element.trigger('change');
                }
            };

            // rebuild cache when multiselect is updated
            var doc = $(document).bind('multiselectrefresh', $.proxy(function () {
                this.updateCache();
                this._handler();
            }, this));

            // automatically reset the widget on close?
            if (this.options.autoReset) {
                doc.bind('multiselectclose', $.proxy(this._reset, this));
            }

            doc.bind('click', function (e) {
                if (!$(e.target).parent().hasClass('ui-multiselect-filter')) {
                    self.span.addClass('disabled');
                }
            });
        },

        // thx for the logic here ben alman
        _handler: function (e) {
            var term = $.trim(this.input[0].value.toLowerCase()),

            // speed up lookups
            rows = this.rows, inputs = this.inputs, cache = this.cache;
            
            if (!term) {
                rows.show();
            } else {
                rows.hide();

                var regex = new RegExp(term.replace(rEscape, "\\$&"), 'gi');

                this._trigger("filter", e, $.map(cache, function (v, i) {
                    if (v.search(regex) !== -1) {
                        rows.eq(i).show();
                        return inputs.get(i);
                    }

                    return null;
                }));
            }
           
            // show/hide optgroups
            this.instance.menu.find(".ui-multiselect-optgroup-label").each(function () {
                var $this = $(this);
                var isVisible = $this.nextUntil('.ui-multiselect-optgroup-label').filter(function () {
                    return $.css(this, "display") !== 'none';
                }).length;

                $this[isVisible ? 'show' : 'hide']();
            });
        },

        _reset: function () {
            this.input.val('').trigger('keyup');
        },

        updateCache: function () {
            // each list item
            this.rows = this.instance.menu.find(".ui-multiselect-checkboxes li:not(.ui-multiselect-optgroup-label, .ui-multiselect-optgroup)");
           
            // cache
            this.cache = this.element.children().map(function () {
                var elem = $(this);

                // account for optgroups
                if (this.tagName.toLowerCase() === "optgroup") {
                    elem = elem.children();
                }

                return elem.map(function () {
                    return this.innerHTML.toLowerCase();
                }).get();
            }).get();
        },

        widget: function () {
            return this.wrapper;
        },

        destroy: function () {
            $.Widget.prototype.destroy.call(this);
            this.input.val('').trigger("keyup");
            this.wrapper.remove();
        }
    });

})(jQuery);