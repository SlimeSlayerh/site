let score = 0;
let clickPower = 1; // monta pisteitä annettaan klikkauksesta
let autoClicker = 0;
let critChance = 0;
const critMultiplier = 2;
let totalEarned = 0;
let totalClicks = 0;
let totalCrits = 0;
let currentStreak = 0;
let bestStreak = 0;
let streakBonusTotal = 0;
let streakBonusCurrent = 0;
let streakMode = false;
let recentClickTimes = [];
let streakTimer = null;
// Nämä arvot säätää streakin vaikeutta
const streakTimeoutMs = 500; // jos et klikkaa näin pitkään (ms), streak loppuu
const streakActivateWindowMs = 850; // aikaikkuna (ms), jonka sisällä klikkejä lasketaan streakin aloitukseen
const streakActivateClicks = 7; // montako klikkiä tarvitaan aikaikkunassa, että streak alkaa
const circle =
document.getElementById("circle");
const scoreText =
document.getElementById("score");
const circleWrapper =
document.getElementById("circleWrapper");
const totalEarnedText = document.getElementById("totalEarned");
const statClickPowerText = document.getElementById("statClickPower");
const statAutoClickerText = document.getElementById("statAutoClicker");
const statCritChanceText = document.getElementById("statCritChance");
const statCritMultiplierText = document.getElementById("statCritMultiplier");
const statTotalClicksText = document.getElementById("statTotalClicks");
const statTotalCritsText = document.getElementById("statTotalCrits");
const statCurrentStreakText = document.getElementById("statCurrentStreak");
const statBestStreakText = document.getElementById("statBestStreak");
const statStreakBonusTotalText = document.getElementById("statStreakBonusTotal");
function updateStats() {
	// Päivitetään kaikki stats-tekstit ruudulle
	scoreText.textContent = score;
	totalEarnedText.textContent = totalEarned;
	statClickPowerText.textContent = clickPower;
	statAutoClickerText.textContent = autoClicker;
	statCritChanceText.textContent = Math.round(critChance * 100);
	statCritMultiplierText.textContent = critMultiplier;
	statTotalClicksText.textContent = totalClicks;
	statTotalCritsText.textContent = totalCrits;
	statCurrentStreakText.textContent = currentStreak;
	statBestStreakText.textContent = bestStreak;
	statStreakBonusTotalText.textContent = streakBonusTotal;
}
function addPoints(points) {
	// Kaikki pisteiden lisäys kulkee tämän kautta
	score += points;
	totalEarned += points;
	updateStats();
}
function showCritText(points) {
	const critText = document.createElement("div");
	critText.classList.add("critText");
	critText.textContent = `CRIT! +${points}`;
	critText.style.left = "50%";
	critText.style.top = "50%";
	circleWrapper.appendChild(critText);
	
	setTimeout(() => {
		critText.remove();
	}, 600);
}
function showStreakEndText(points) {
	const streakText = document.createElement("div");
	streakText.classList.add("streakEndText");
	streakText.textContent = `Streak ended! Bonus +${points}`;
	streakText.style.left = "50%";
	streakText.style.top = "15%";
	circleWrapper.appendChild(streakText);
	
	setTimeout(() => {
		streakText.remove();
	}, 1300);
}
function showStreakStartText() {
	const streakText = document.createElement("div");
	streakText.classList.add("streakStartText");
	streakText.textContent = "STREAK MODE!";
	streakText.style.left = "50%";
	streakText.style.top = "15%";
	circleWrapper.appendChild(streakText);
	
	setTimeout(() => {
		streakText.remove();
	}, 900);
}
function resetStreakTimer() {
	// Jos uusi klikki tulee, vanha timeout poistetaan
	if (streakTimer) {
		clearTimeout(streakTimer);
	}
	
	// Jos ei klikata hetkeen, streak loppuu
	streakTimer = setTimeout(() => {
		if (streakMode && streakBonusCurrent > 0) {
			showStreakEndText(streakBonusCurrent);
		}
		
		streakMode = false;
		circle.classList.remove("streakActive");
		recentClickTimes = [];
		currentStreak = 0;
		streakBonusCurrent = 0;
		updateStats();
	}, streakTimeoutMs);
}
circle.onclick = function () {
	const now = Date.now();
	let pointsFromClick = clickPower;
	totalClicks += 1;
	
	// Tallennetaan klikin aika
	recentClickTimes.push(now);
	// Otetaan vain tuoreet klikit mukaan (window ms)
	recentClickTimes = recentClickTimes.filter(time => now - time <= streakActivateWindowMs);
	
	// Streak alkaa jos klikkejä on tarpeeksi lyhyessä ajassa
	if (!streakMode && recentClickTimes.length >= streakActivateClicks) {
		streakMode = true;
		currentStreak = 0;
		streakBonusCurrent = 0;
		circle.classList.add("streakActive");
		showStreakStartText();
	}
	
	if (streakMode) {
		currentStreak += 1;
		bestStreak = Math.max(bestStreak, currentStreak);
		
		// Bonus kasvaa kun streak jatkuu
		const streakBonus = Math.max(1, Math.floor((clickPower * 0.35) + (currentStreak * 0.25)));
		pointsFromClick += streakBonus;
		streakBonusTotal += streakBonus;
		streakBonusCurrent += streakBonus;
		
		// Tämä "resetoi" pulse-animaation jokaisella klikkauksella
		circle.classList.remove("streakPulse");
		void circle.offsetWidth;
		circle.classList.add("streakPulse");
	}
	
	// Crit-rolli joka klikkauksella
	if (Math.random() < critChance) {
		totalCrits += 1;
		pointsFromClick *= critMultiplier;
		circle.classList.add("critHit");
		setTimeout(() => circle.classList.remove("critHit"), 150);
		showCritText(pointsFromClick);
	}
	
	addPoints(pointsFromClick);
	resetStreakTimer();
};
// menu
const upgradeBtn = document.getElementById("upgradeBtn");
const upgradeMenu = document.getElementById("upgradeMenu");
upgradeBtn.onclick = function () {
	if (upgradeMenu.style.display === "none" || upgradeMenu.style.display === "") {
		upgradeMenu.style.display = "block";
    }
	else {
		upgradeMenu.style.display = "none";
		
    }
};
// upgrades
const upgrade1 = document.getElementById("upgrade1");
let hasUpgrade1 = false;
let costUpgrade1 = 10;
/* upgrade1.onclick = function () {
	const cost = 10;
	
	if (hasUpgrade1) {
		return
	}
	else if (score >= cost) {
		score -= cost;
		clickPower += 1; // annettaan enemmän pisteittä klikkauksesta
		scoreText.textContent = score;
		
		upgrade1.textContent = `Increase Click Power ✔`;
		
		upgrade1.disabled = true; // ei saa enää klikata
		hasUpgrade1 = true;
		
	}
	else {
		alert("Not enough points");
	}
	
}; */
upgrade1.onclick = function () {
	
	if (score >= costUpgrade1) {
		score -= costUpgrade1;
		clickPower += 1; // annettaan enemmän pisteittä klikkauksesta
		updateStats();
		
		costUpgrade1 = Math.floor(costUpgrade1 * 1.5); // hinta nousee
		
		upgrade1.textContent = `Increase click power (Cost: ${costUpgrade1})`;
		
	}
	else {
		alert("Not enough points");
	}
	
};
const upgrade2 = document.getElementById("upgrade2");
let costUpgrade2 = 50;
const upgrade3 = document.getElementById("upgrade3");
let costUpgrade3 = 75;
// auto clicker cursors
const cursorPositions = [0, 60, 120, 180, 240, 300];
function addAutoCursor(index) {
	// Lasketaan paikka ympyrän ympärille kulman avulla
	const angle = (cursorPositions[index] ?? (index * 47)) * (Math.PI / 180);
	const radius = 95;
	const x = 75 + radius * Math.cos(angle) - 12;
	const y = 75 + radius * Math.sin(angle) - 12;
	
	const cursor = document.createElement("div");
	cursor.classList.add("autoCursor");
	cursor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="1.5">
    <path d="M4 2 L4 17 L7 14 L10 20 L12 19 L9 13 L13 13 Z"/>
</svg>`;
	cursor.style.left = x + "px";
	cursor.style.top = y + "px";
	circleWrapper.appendChild(cursor);
}


upgrade2.onclick = function () {
	
	if (score >= costUpgrade2) {
		score -= costUpgrade2;
		autoClicker += 1;
		updateStats();
		
		addAutoCursor(autoClicker - 1); // lisää kursori ympyrän ympärille
		
		costUpgrade2 = Math.floor(costUpgrade2 * 1.5); // hinta nousee
		
		upgrade2.textContent = `Auto Clicker (Cost: ${costUpgrade2})`;
		
	}
	else {
		alert("Not enough points");
	}
	
};
upgrade3.onclick = function () {
	if (critChance >= 0.75) {
		upgrade3.disabled = true;
		upgrade3.textContent = "Critical Click Chance MAXED (75%)";
		return;
	}
	
	if (score >= costUpgrade3) {
		score -= costUpgrade3;
		critChance = Math.min(0.75, critChance + 0.05); // max 75%
		updateStats();
		
		if (critChance >= 0.75) {
			upgrade3.disabled = true;
			upgrade3.textContent = "Critical Click Chance MAXED (75%)";
		}
		else {
			costUpgrade3 = Math.floor(costUpgrade3 * 1.6);
			upgrade3.textContent = `Critical Click Chance +5% (Cost: ${costUpgrade3})`;
		}
	}
	else {
		alert("Not enough points");
	}
};
setInterval(() => {
    if (autoClicker > 0) {
        addPoints(autoClicker); // jokainen autoclicker antaa 1 piste/s
		
		// animoi kursorit
		document.querySelectorAll(".autoCursor").forEach(cursor => {
			cursor.classList.add("clicking");
			setTimeout(() => cursor.classList.remove("clicking"), 150);
		});
		
		// animoi ympyrä
		circle.classList.add("autoClick");
		setTimeout(() => circle.classList.remove("autoClick"), 150);
    }
}, 1000); // runs every second

const debugBtn = document.getElementById("debugBtn");
debugBtn.onclick = function () {
	addPoints(100000);
};
updateStats();