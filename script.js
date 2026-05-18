class DamianoAssistant
{
    constructor()
    {
        this.input = document.getElementById("command-input");
        this.output = document.getElementById("output-area");
        this.map = null;
        this.facts = [
            "Il Sole rappresenta il 99.86% della massa del Sistema Solare.",
            "Una stella di neutroni è così densa che un cucchiaino peserebbe come l'Everest.",
            "I polpi hanno tre cuori e sangue blu.",
            "L'universo si espande più velocemente della luce.",
            "Le formiche non hanno polmoni e non dormono mai.",
            "La luce del sole impiega 8 minuti e 20 secondi per arrivare a noi."
        ];
        this.setupListeners();
    }

    setupListeners()
    {
        this.input.addEventListener("keydown", (e) => 
        { 
            if(e.key === "Enter") 
            {
                this.handleCommand(); 
            }
        });

        document.getElementById("execute-btn").addEventListener("click", () => 
        { 
            this.handleCommand(); 
        });

        document.getElementById("clear-btn").addEventListener("click", () => 
        { 
            this.clearOutput(); 
        });

        document.getElementById("help-btn").addEventListener("click", () => 
        {
            this.input.value = "help";
            this.handleCommand();
        });
    }

    handleCommand()
    {
        const raw = this.input.value.trim();
        if(!raw) 
        {
            return;
        }
        this.input.value = "";
        
        this.print(`➜ CMD_INPUT: ${raw}`, "command");
        const args = raw.toLowerCase().split(" ");
        const cmd = args[0];

        switch(cmd)
        {
            case "nota":
                this.print(`APPUNTO SALVATO: ${raw.substring(5)}`, "nota");
                break;
            case "clear":
                this.clearOutput();
                break;
            case "help":
                this.showHelp();
                break;
            case "notizie":
                window.open("https://news.google.com/it", "_blank");
                this.print("Accesso ai canali news mondiali.", "success");
                break;
            case "wikipedia":
                window.open(`https://it.wikipedia.org/wiki/${encodeURIComponent(raw.substring(10))}`, "_blank");
                this.print("Ricerca Wikipedia avviata.", "success");
                break;
            case "curiosità": 
            case "curiosita":
                this.print(`CURIOSITÀ: ${this.facts[Math.floor(Math.random() * this.facts.length)]}`, "success");
                break;
            case "traduce":
                window.open(`https://translate.google.com/?text=${encodeURIComponent(raw.substring(8))}&op=translate`, "_blank");
                this.print("Modulo traduzione attivato.", "success");
                break;
            case "naviga":
                this.showMap(raw.substring(7));
                break;
            case "meteo":
                this.getWeather();
                break;
            case "ora":
                this.print(`ORA SISTEMA: ${new Date().toLocaleTimeString()}`, "success");
                break;
            case "google":
                window.open(`https://www.google.com/search?q=${encodeURIComponent(raw.substring(7))}`, "_blank");
                break;
            case "youtube":
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(raw.substring(8))}`, "_blank");
                break;
            case "amazon":
                window.open(`https://www.amazon.it/s?k=${encodeURIComponent(raw.substring(7))}`, "_blank");
                break;
            case "apri":
                let url = raw.substring(5).trim();
                if (!url.startsWith("http")) 
                {
                    url = "https://" + url;
                }
                window.open(url, "_blank");
                break;
            case "calcola":
                this.calculate(raw.substring(8));
                break;
            case "speedtest":
                window.open("https://www.speedtest.net/", "_blank");
                break;
            default:
                this.print("PROTOCOLLO NON RICONOSCIUTO. Digita 'help'.", "error");
        }
    }

    print(msg, type = "")
    {
        const div = document.createElement("div");
        div.className = `output-line ${type}`;
        div.textContent = msg;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    }

    clearOutput()
    {
        this.output.innerHTML = "";
        this.print("LOG CONSOLE RESETTATO.", "info");
    }

    calculate(exp)
    {
        try 
        { 
            this.print(`RISULTATO: ${eval(exp.replace(/[^-()\d/*+.]/g, ''))}`, "success"); 
        }
        catch (e)
        { 
            this.print("Errore matematico.", "error"); 
        }
    }

    async showMap(loc)
    {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${loc}`);
        const data = await res.json();
        if(data[0])
        {
            const mapDiv = document.createElement("div"); 
            mapDiv.id = "map";
            this.output.appendChild(mapDiv);
            if(this.map) 
            {
                this.map.remove();
            }
            this.map = L.map('map').setView([data[0].lat, data[0].lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
            L.marker([data[0].lat, data[0].lon]).addTo(this.map);
            this.output.scrollTop = this.output.scrollHeight;
        }
    }

    getWeather()
    {
        navigator.geolocation.getCurrentPosition(async (pos) => 
        {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
            const d = await res.json();
            this.print(`METEO ATTUALE: ${d.current_weather.temperature}°C`, "success");
        });
    }

    showHelp()
    {
        this.print("--- PROTOCOLLI SISTEMA DAMIANO V12 ---", "success");
        
        const commands = [
            { c: "> nota [testo]", d: "(Appunto rapido)" },
            { c: "> notizie", d: "(Ultime news mondiali)" },
            { c: "> wikipedia [testo]", d: "(Cerca enciclopedia)" },
            { c: "> curiosità", d: "(Fatti database)" },
            { c: "> traduce [testo]", d: "(Inglese)" },
            { c: "> naviga [luogo]", d: "(Ologramma mappa)" },
            { c: "> meteo", d: "(Dati locali)" },
            { c: "> ora", d: "(Orario di sistema)" },
            { c: "> calcola [operazione]", d: "(Esegui calcolo)" },
            { c: "> google [ricerca]", d: "(Cerca sul web)" },
            { c: "> youtube [video]", d: "(Cerca video)" },
            { c: "> amazon [shopping]", d: "(Cerca prodotti)" },
            { c: "> apri [sito.it]", d: "(Apertura diretta)" },
            { c: "> speedtest", d: "(Analisi rete)" },
            { c: "> clear", d: "(Pulisce console)" }
        ];

        commands.forEach(cmd => 
        {
            this.print(cmd.c, "help-item");
            this.print(cmd.d, "help-desc");
        });
    }
}

window.onload = () => 
{
    new DamianoAssistant();
};
