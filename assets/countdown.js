if (!customElements.get("countdown-timer")) {
  class Countdown extends HTMLElement {
    constructor() {
      super();

      this.enableMockTimer =
        this.getAttribute("data-enable-mock-timer") === "true";

      if (this.enableMockTimer) {
        // get data for infinite mock timer
        const INFINITE_DAYS = this.getAttribute("data-enable-mock-picker-day")
          ? Number(this.getAttribute("data-enable-mock-picker-day"))
          : 2;
        const DIFF_HOURS = this.getAttribute("data-enable-mock-picker-hours")
          ? Number(this.getAttribute("data-enable-mock-picker-hours"))
          : 3;
        const now = new Date();
        const futureDate = new Date(
          now.getTime() + (INFINITE_DAYS * 24 + DIFF_HOURS) * 60 * 60 * 1000
        );
        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, "0");
        const day = String(futureDate.getDate()).padStart(2, "0");
        const hours = String(futureDate.getHours()).padStart(2, "0");
        const minutes = String(futureDate.getMinutes()).padStart(2, "0");
        this.userDate = `${year}-${month}-${day}`;
        this.userTime = `${hours}:${minutes}`;
      } else {
        // get data from section settings
        this.userDate = this.getAttribute("data-date");
        this.userTime = this.getAttribute("data-time");
      }
      // ----------------------------------------------------------------
      this.hasAnimation = this.getAttribute("data-has-animation") === "true";
      this.interval;
      this.isStarted = false;
      this.setInterval(this.userDate, this.userTime);
    }

    onInit(userDate, userTime) {
      this.completedCountdown = this.getAttribute("data-completed");
      this.countdown = this.querySelector(".countdown__main");
      this.countdownEndText = this.querySelector(".countdown__end-info");
      this.daysEls = this.querySelectorAll(".countdown_block_days");
      this.hoursEls = this.querySelectorAll(".countdown_block_hours");
      this.minutesEls = this.querySelectorAll(".countdown_block_minutes");
      this.secondsEls = this.querySelectorAll(".countdown_block_seconds");
      this.section =
        this.closest(".countdown-section") ||
        this.closest(".announcement-bar countdown-timer");
      // ----------------------------------------------------------------
      const countdownDate = new Date(`${userDate}T${userTime}`);
      const now = new Date();
      const distance = countdownDate.getTime() - now.getTime();
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // ----------------------------------------------------------------
      if (distance < 0 && this.completedCountdown === "hide_section") {
        this.section.style.display = "none";
        clearInterval(this.interval);
      } else if (distance < 0 && this.completedCountdown === "show_text") {
        this.countdown.style.display = "none";
        this.countdownEndText.style.display = "flex";
        clearInterval(this.interval);
      } else {
        if (!this.hasAnimation) {
          this.daysEls.forEach((el) => {
            el.textContent = this.getTwoDigitTime(days);
          });

          this.hoursEls.forEach((el) => {
            el.textContent = this.getTwoDigitTime(hours);
          });

          this.minutesEls.forEach((el) => {
            el.textContent = this.getTwoDigitTime(minutes);
          });

          this.secondsEls.forEach((el) => {
            el.textContent = this.getTwoDigitTime(seconds);
          });
        } else {
          // get time in next second for animate
          const nextSecond = new Date(now.getTime() + 1000);
          const distance_next = countdownDate.getTime() - nextSecond.getTime();
          const days_next = Math.floor(distance_next / (1000 * 60 * 60 * 24));
          const hours_next = Math.floor(
            (distance_next % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes_next = Math.floor(
            (distance_next % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds_next = Math.floor((distance_next % (1000 * 60)) / 1000);

          // animate elements
          const daysId = "countdown-days";
          if (this.timeHasChanged(daysId, this.getTwoDigitTime(days_next))) {
            this.animateElement(
              daysId,
              this.getTwoDigitTime(days),
              this.getTwoDigitTime(days_next),
              !this.isStarted
            );
          }

          const hoursId = "countdown-hours";
          if (this.timeHasChanged(hoursId, this.getTwoDigitTime(hours_next))) {
            this.animateElement(
              hoursId,
              this.getTwoDigitTime(hours),
              this.getTwoDigitTime(hours_next),
              !this.isStarted
            );
          }

          const minId = "countdown-minutes";
          if (this.timeHasChanged(minId, this.getTwoDigitTime(minutes_next))) {
            this.animateElement(
              minId,
              this.getTwoDigitTime(minutes),
              this.getTwoDigitTime(minutes_next),
              !this.isStarted
            );
          }

          const secId = "countdown-seconds";
          if (this.timeHasChanged(secId, this.getTwoDigitTime(seconds_next))) {
            this.animateElement(
              secId,
              this.getTwoDigitTime(seconds),
              this.getTwoDigitTime(seconds_next)
            );
          }

          this.isStarted = true;
        }
      }
    }

    animateElement(elementId, newValue, newValueNext, preventAnimation) {
      const block = this.querySelector(`#${elementId}`);
      const clone = block.cloneNode(true);
      const spaceEl = clone.querySelector(".countdown__block_num--spacer");
      if (!preventAnimation) {
        clone.classList.add("date-animate");
      }

      block.after(clone);
      block.remove();

      if (spaceEl) spaceEl.textContent = newValueNext;
      this.updateFrontValues(clone, newValue);
      this.updateBackValues(clone, newValueNext);
    }

    timeHasChanged(timeId, newRemainingTime) {
      const element = this.querySelector(`#${timeId}`)
        .querySelector(".countdown__block_num--upper-back")
        .getElementsByTagName("span")[0];
      const value = element.innerHTML;
      return parseInt(value) !== parseInt(newRemainingTime);
    }

    updateFrontValues(element, value) {
      const upper = element.querySelector(".countdown__block_num--upper");
      const lower = element.querySelector(".countdown__block_num--lower");

      upper.getElementsByTagName("span")[0].textContent = value;
      lower.getElementsByTagName("span")[0].textContent = value;
    }

    updateBackValues(element, value) {
      const upper = element.querySelector(".countdown__block_num--upper-back");
      const lower = element.querySelector(".countdown__block_num--lower-back");

      upper.getElementsByTagName("span")[0].textContent = value;
      lower.getElementsByTagName("span")[0].textContent = value;
    }

    getTwoDigitTime(time) {
      if (String(time).length === 1) {
        return "0" + time;
      }
      if (String(time) === "-1") {
        return "00";
      }
      return time;
    }

    setInterval(userDate, userTime) {
      clearInterval(this.interval);
      this.interval = setInterval(
        this.onInit.bind(this, userDate, userTime),
        1000
      );
    }
  }

  customElements.define("countdown-timer", Countdown);
}
