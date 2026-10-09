const fs = require('fs');

const fixString = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  // Replace the Date object logic with a fallback to the raw strings
  code = code.replace(
    /\{new Date\(settings\.rsvp\.deadline\)\.toLocaleDateString\('it-IT', \{ day: 'numeric', month: 'long' \}\)\}/g,
    "{settings.event.rsvpDeadline || settings.rsvp?.deadline || '29 Aprile 2027'}"
  );
  fs.writeFileSync(file, code);
};

fixString('src/components/home/Hero.tsx');
fixString('src/components/rsvp/RsvpStepper.tsx');

