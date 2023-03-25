onload = () => {
    
    "use strict";
	
    const _s = (selector) => document.querySelector(selector);
	
    const _a = (selector) => document.querySelectorAll(selector);
	
    const rnd = (max = 1, min = 0) => Math.random() * (max - min) + min;
	
    const imei = () => {
	
		let imei = "35";
		
        for (let i = 0; i < 13; i++) imei += Math.round(rnd(9));
		
        return imei;
	
    };
	
    const IMEI = imei();
	
    const clr = (text) => text.slice(0, text.length - 1);
	
    const wait = (ms) => new Promise((func) => setTimeout(func, ms));
	
    const hideAll = () =>
    
    _a("#container > section").forEach((pn) => (pn.style.display = ""));
	
    const offAll = () => _a(".key").forEach((key) => (key.onclick = null));
	
    const show = (elem, off = true) => {
	
        const _self = _s("#" + elem);
	
        if (_self.style.display === "flex") return;
	
        if (off) offAll();
	
        hideAll();
	
        _self.style.display = "flex";
	
    };

	const _msg = _s("#message");
	
    const _wrp = _s("#screen");
	
    const _scr = _s("#container");
	
    const _pow = _s("#key-pow");
	
    const _clr = _s("#key-clr");
	
    const _nav = _s("#key-nav");
	
    const _up = _s("#key-up");
	
    const _down = _s("#key-down");
	
    const _num = (fnc) =>
	
    _a(".num").forEach((key) => (key.onclick = (e) => fnc(e)));

	var started;
    
	function start() {
	
        started = true;
	
        _wrp.style.background = "#99a883";
	
        _scr.style.background = "#555";
	
        if (navigator.vibrate) navigator.vibrate(200);
	
        wait(1000).then(pin);
	
    }

	function stop() {
	
        started = false;
	
        _wrp.style.background = "";
	
        _scr.style.background = "";
	
        offAll();
	
        hideAll();
	
    }

	function pin() {
	
        show("screen-pin");

		const pwd = _s("#enterpin");
	
        _scr.style.background = "rgba(0, 0, 0, 0.1)";
	
        _clr.onclick = (e) => (pwd.value = clr(pwd.value));
	
        _nav.onclick = (e) => {
	
            if (pwd.value === "1100") {
	
                wait(1500).then(standby);
	
                _wrp.style.visibility = "hidden";
	
                _msg.textContent = "";
	
            } else {
	
                _msg.textContent = "Enter 1100";
	
            }
	
        };
	
        _num((e) => {
	
            const val = e.target.id.split("-")[1];
	
            if (!/hash|aste/.test(val) && pwd.value.length < 4) pwd.value += val;
	
        });
	
    }

	function standby() {
	
        show("screen-standby");

		_wrp.style.visibility = "";
	
        _a(".levelbar").forEach((bar) => {
	
            const lv = bar.dataset.lv;
	
            const frag = document.createDocumentFragment();
	
            var w = 8;

			for (var i = 0; i < 7; i++) {

                const step = document.createElement("div");

                step.className = "step";

                if (i < 3) {

                    step.style.width = w + "px";

                    w -= 2;

                }

                frag.appendChild(step);

            }

            bar.innerHTML = "";

            bar.appendChild(frag);

        });
		
        const updateClock = () => {
		
            const today = new Date();
		
            const pad0 = (o) => (o < 10 ? "0" + o : o);
		
            const time = pad0(today.getHours()) + ":" + pad0(today.getMinutes());
		
            _s("#clock").innerText = time;
		
        };

		const updateSignal = () => {

            _a("#signal > .step").forEach((step) => {

                step.style.background = navigator.onLine ? "#000" : "";

            });

            _s("#signal-txt").innerText = navigator.onLine ? "WI-FI" : "--";

        };

		const updateBattery = () => {

            if (!navigator.getBattery) return;

            navigator.getBattery().then((battery) => {

                const level = battery.level * 10;

                const from = (val) =>

                _a("#battery > .step").forEach((step, i) => {

                    if (i >= val) step.style.background = "#000";

                });

                if (level >= 8) from(0);

                else if (level >= 6.5 && level <= 8) from(1);

                else if (level >= 5 && level <= 6.5) from(2);

                else if (level >= 4 && level <= 5) from(3);

                else if (level >= 3 && level <= 4) from(4);

                else if (level >= 2 && level <= 3) from(5);

                else from(6);

            });

        };

		const _call = _s("#call");
		
        const _text = _s("#call + div");
		
        _pow.onclick = (e) => {
		
            show("screen-standby", false);
		
            _call.innerText = "";
		
            _text.style.display = "";
		
        };
		
        _clr.onclick = (e) => {
		
            if (_call.innerText.length <= 1 || _call.innerText.indexOf("Serial") >= 0)
		
            _pow.click();
		
            _call.innerText = clr(_call.innerText);
		
        };
		
        _nav.onclick = (e) => {
		
            if (_call.innerText.indexOf("Serial") >= 0) return;
		
            if (_call.innerText.length) window.open("tel:" + _call.innerText);
			
            else menu();
		
        };
		
        let numclick = (e) => {
		
            show("screen-call", false);
		
            if (_call.innerText.indexOf("Serial") >= 0) return;
		
            let val = e.target.id.split("-")[1];
		
            val = val === "aste" ? "*" : val === "hash" ? "#" : val;
		
            _call.innerText += val;
		
        };
		
        _num(numclick);
		
        _s("#num-hash").onclick = (e) => {

            if (_call.innerText !== "*#06") numclick(e);
		
            else {
		
                _call.innerText = "Serial no.\n";
		
                _call.innerText += IMEI;

                _text.style.display = "none";
		
            }
		
        };

		setInterval(() => {

            updateClock();

            updateSignal();

            updateBattery();

        }, 1000);

    }

	function menu() {

        show("screen-menu");

		var index = 0;

        const _menu = _s("#menu");

        const _sbar = _s("#screen-menu .handle");

        const _class = _menu.className;

        const menus = ["Messages", "Contacts", "Tones", "Settings", "Extras"];

        const menu_h = 100 / menus.length;

        const nav = (dir) => {

            if (dir === "up" && index > 0) index--;

            if (dir === "down" && index < menus.length - 1) index++;

            _menu.innerText = menus[index];

            _menu.className = _class + " " + menus[index].toLowerCase();

            _sbar.style.top = index * menu_h + "%";

        };

        _sbar.style.height = menu_h + "%";

        nav();

        _up.onclick = () => nav("up");

        _down.onclick = () => nav("down");

        _pow.onclick = standby;

        _clr.onclick = standby;

        _nav.onclick = () => alert("That's all for now.\nThanks for viewing.");

	}

	function route(index) {

        switch (index) {

            case 0:

            break;

            case 1:

            break;

            case 2:

            break;

            case 3:

            break;

            case 4:
		
            break;
        
        }
    
    }

	function _hold(type) {

        const events =

        type === "touch" ? ["touchstart", "touchend"] : ["mousedown", "mouseup"];

        _pow.addEventListener(events[0], (e) => {

            const target = e.target;

            const timer = setTimeout(started ? stop : start, 1200);

            e.target.addEventListener(events[1], () => clearTimeout(timer));

        });

    }

    _hold("mouse");

    _hold("touch");

};