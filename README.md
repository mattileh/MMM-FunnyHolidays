# MMM-FunnyHolidays
Ever wanted to bring your teddybear to work? - you can do it on "Bring Your Teddy Bear To Work & School Day" on 8th of october
or need to get hammered at 9am, well do it with dry-martinis on "James Bond Day" 2019-10-05.

MM2 modules for showing "funny" holidays around world from webcal.fi source

### MagicMirror² platform
* https://magicmirror.builders/

### MagicMirror² 3rd party modules
* https://github.com/MichMich/MagicMirror/wiki/3rd-party-modules

### Datasource webcal.fi
* www.webcal.fi

### Example UI of module installed

![Example UI](/documentation/exampleui.png)

* Funnyholidays shown in upper notification area

# Installation guide

### clone 
* Clone MMM-FunnyHolidays under modules in the MM2 platform as all 3rd party modules
* run `npm install` in module's directory to install request module
* Configuration (into config/config.js) :

```
		{
			module: "MMM-FunnyHolidays",
			position: "top_bar",
			config: {
				showSourceLogo: false
			}
		},
```

`showSourceLogo` is optional configuration that will show also a small icon of the datasource

# Special thanks

* the datasource www.webcal.fi
