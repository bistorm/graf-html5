$(document).ready(function(){
	var obj_graphical = {
		id_html: "",
		type: "AIRBONE_SOUND", //AIRBONE_SOUND, IMPACT_SOUND, ABSORPTION_COEF, ABSORPTION_AREA, RT 
		title: "",
		frequencies: [],
		values: [],
		height: 0,
		width: 0,

		id_canvas: "",
		margin: 0,
		int_rec_height: 0,
		int_rec_width: 0,
		graphical_axis_values: [],
	} 

	const FREQUENCIES_1OCT = [63,125,250,500,1000,2000,4000];

	function draw_graphical(obj_graphical)
	{
		obj_graphical.id_canvas = "canvas_"+obj_graphical.id_html;
		$("#"+obj_graphical.id_html).html("<canvas height='"+obj_graphical.height+"px' width='"+obj_graphical.width+"px' class='graphical-space' id='"+obj_graphical.id_canvas+"'>Browser does not support canvas</canvas>");	
		
		obj_graphical.margin = 0.05*Math.min(obj_graphical.height,obj_graphical.width);
		obj_graphical.int_rec_height = obj_graphical.height - 2*obj_graphical.margin;
		obj_graphical.int_rec_width = obj_graphical.width - 2*obj_graphical.margin;
		
		draw_bass_freq_shading(obj_graphical);
		draw_freq_lines(obj_graphical);
		draw_values_lines(obj_graphical);
		draw_graphical_title(obj_graphical);
		draw_values(obj_graphical);
		draw_graphical_rectangle(obj_graphical);
	}

	function draw_graphical_rectangle(obj_graphical)
	{
		draw_rectangle(obj_graphical.id_canvas, obj_graphical.margin, obj_graphical.margin, obj_graphical.int_rec_width, obj_graphical.int_rec_height, null,"rgb(24,24,24)","1");
	}

	function draw_bass_freq_shading(obj_graphical)
	{
		var bass_freq_width = obj_graphical.margin + (obj_graphical.width - 2*obj_graphical.margin)*1.3/(obj_graphical.frequencies.length-1);
		draw_rectangle(obj_graphical.id_canvas, obj_graphical.margin, obj_graphical.margin, bass_freq_width, obj_graphical.int_rec_height, "rgb(240,240,240)","rgb(24,24,24)","0");	
	}

	function draw_freq_lines(obj_graphical)
	{
		var i = 0;
		var y1 = obj_graphical.margin;
		var y2 = obj_graphical.height - obj_graphical.margin;
		var text_size = Math.round(Math.min(obj_graphical.margin*0.4,42));

		for(i=1;i<obj_graphical.frequencies.length-1;i++)
		{
			var x = obj_graphical.margin + (obj_graphical.width - 2*obj_graphical.margin)*i/(obj_graphical.frequencies.length-1);
			if(FREQUENCIES_1OCT.indexOf(obj_graphical.frequencies[i])!=-1)
			{
				draw_line(obj_graphical.id_canvas, x, y1, x, y2,"rgb(146,146,146)");
				if(obj_graphical.width > 200 && obj_graphical.height > 200)
				{
					draw_text(obj_graphical.id_canvas, x, y2+obj_graphical.margin*0.6, obj_graphical.frequencies[i], text_size+"px Arial", "rgb(146,146,146)","center");
				}
			}
			else
			{
				draw_line(obj_graphical.id_canvas, x, y1, x, y2,"rgb(231,231,231)");
			}		
		}
	}

	function draw_values_lines(obj_graphical)
	{
		var i = 0;
		var j = 0;
		var k = 0;
		var x1 = obj_graphical.margin;
		var x2 = obj_graphical.width - obj_graphical.margin;

		var graphical_axis_values = [];
		var max_value = Math.ceil(Math.max(...obj_graphical.values));
		var min_value = Math.floor(Math.min(...obj_graphical.values));

		while(max_value%5 != 0)
		{
			++max_value;
		}

		while(min_value%5 != 0)
		{
			--min_value;
		}

		for(i=min_value-5;i<=max_value+5;i=i+5)
		{
			graphical_axis_values.push(i);
		}

		for(j=1;j<graphical_axis_values.length-1;j++)
		{
			var y = obj_graphical.margin + (obj_graphical.height - 2*obj_graphical.margin)*j/(graphical_axis_values.length-1);
			if(graphical_axis_values[j]%10 != 0)
			{
				draw_line(obj_graphical.id_canvas, x1, y, x2, y,"rgb(231,231,231)");
			}
			else
			{
				draw_line(obj_graphical.id_canvas, x1, y, x2, y,"rgb(146,146,146)");
			}
		}

		if(obj_graphical.width > 200 && obj_graphical.height > 200)
		{
			var text_size = Math.round(Math.min(obj_graphical.margin*0.4,42));
			for(k=0;k<graphical_axis_values.length;k++)
			{
				var y = obj_graphical.margin + (obj_graphical.height - 2*obj_graphical.margin)*k/(graphical_axis_values.length-1);
				draw_text(obj_graphical.id_canvas, x1-obj_graphical.margin*0.5, y+3, graphical_axis_values[graphical_axis_values.length - k -1], text_size+"px Arial", "rgb(146,146,146)","center");
			}
		}
		obj_graphical.graphical_axis_values = graphical_axis_values;
	}

	function draw_graphical_title(obj_graphical){
		if(obj_graphical.width > 200 && obj_graphical.height > 200)
		{
			var text_size = Math.round(Math.min(obj_graphical.margin*0.4,42));
			draw_text(obj_graphical.id_canvas,obj_graphical.margin,obj_graphical.margin*0.7,obj_graphical.title, text_size+"px Arial","rgb(146,146,146)","left");
		}
	}

	function draw_values(obj_graphical){
		var i = 0;
		var column_width = (obj_graphical.width - 4*obj_graphical.margin)/obj_graphical.frequencies.length;

		for(i=0;i<obj_graphical.frequencies.length;i++)
		{
			var x = obj_graphical.margin + (obj_graphical.width - 2*obj_graphical.margin)*i/(obj_graphical.frequencies.length-1) - column_width/2;
			var y = obj_graphical.height-obj_graphical.margin;
			var column_height = transform_db_to_px(obj_graphical,obj_graphical.values[i]-obj_graphical.graphical_axis_values[0]);
			var column_color = obtain_column_color(obj_graphical,obj_graphical.values[i]).rgb;
			var column_border_color = obtain_column_border_color(obj_graphical,obj_graphical.values[i]).rgb;
			if(i==0)
			{
				draw_rectangle(obj_graphical.id_canvas, x+column_width*0.5, y, column_width*0.5,-column_height,column_color,column_border_color);
			}
			else if (i==obj_graphical.frequencies.length-1)
			{
				draw_rectangle(obj_graphical.id_canvas, x, y, column_width*0.5,-column_height,column_color,column_border_color);
			}
			else
			{
				draw_rectangle(obj_graphical.id_canvas, x, y, column_width,-column_height,column_color,column_border_color);
			}
		}
	}

	

	function obtain_column_color(obj_graphical,val_db){

		var obj_color={
			green: 0,
			red: 0,
			blue: 2,
			rgb: "",
		}

		switch(obj_graphical.type)
		{
			case "AIRBONE_SOUND":
				if(val_db>55)
				{
					obj_color.green = 225;
					obj_color.red = 0;
				}
				else if(val_db<30)
				{
					obj_color.green = 0;
					obj_color.red = 225;
				}
				else
				{
					obj_color.green = Math.round(Math.min(225/25*(val_db-30),225));
					obj_color.red =  Math.round(225-obj_color.green*0.5);
				}
				break;
			case "IMPACT_SOUND":
				if(val_db>90)
				{
					obj_color.red = 225;
					obj_color.green = 0;
				}
				else if(val_db<55)
				{
					obj_color.red = 0;
					obj_color.green = 225;
				}
				else
				{
					obj_color.red = Math.round(Math.min(225/35*(val_db-55),225));
					obj_color.green = Math.round(225-obj_color.red*0.5);
				}
				break;
		}

		obj_color.rgb = "rgb("+obj_color.red+","+obj_color.green+",2)";

		return obj_color;
	}

	function obtain_column_border_color(obj_graphical,val_db){
		var obj_color = obtain_column_color(obj_graphical,val_db);
		var obj_border_color = {
			green: Math.max(obj_color.green-30,0),
			red: Math.max(obj_color.red-30,0),
			blue: Math.max(obj_color.blue-30,0),
			rgb: "",
		}
		obj_border_color.rgb = "rgb("+obj_border_color.red+","+obj_border_color.green+","+obj_border_color.blue+")";

		return obj_border_color;
	}



	function transform_db_to_px(obj_graphical,val_db)
	{
		var max_length_px = obj_graphical.height-2*obj_graphical.margin;
		var n_values = (obj_graphical.graphical_axis_values.length-1)*5;

		return (max_length_px/n_values)*val_db;
	}

	//Funciones CANVAS

	function draw_rectangle(id_canvas, x, y, width, height, fill_style, stroke_style, line_width)
	{
		var canvas = document.getElementById(id_canvas);
		var ctx = canvas.getContext("2d");
		ctx.beginPath(); 	
		ctx.rect(x,y,width,height);
		
		if(fill_style != null && fill_style != undefined)
		{
			ctx.fillStyle = fill_style;
			ctx.fill();	
		}

		if(stroke_style != null && stroke_style != undefined)
		{
			ctx.strokeStyle = stroke_style;
		}
		else
		{
			ctx.strokeStyle = "#FFF";
		}	

		if (line_width!=0)
		{
			if(line_width === null || line_width === undefined)
			{
				ctx.lineWidth="1";
			}
			else{
				ctx.lineWidth=line_width;
			}
			ctx.stroke();
		}
		
	}

	function draw_line(id_canvas, x1, y1, x2, y2, style, line_width){
		var canvas = document.getElementById(id_canvas);
		var ctx = canvas.getContext("2d");	
		ctx.beginPath(); 
		if(style != null && style != undefined)
		{
			ctx.strokeStyle = style;
		}
		if(line_width != null && line_width != undefined)
		{
			ctx.lineWidth=line_width;
		}
		else
		{
			ctx.lineWidth="1";
		}
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}

	function draw_text(id_canvas, x, y, text, font, style, align)
	{
		var canvas = document.getElementById(id_canvas);
		var ctx = canvas.getContext("2d");	
		ctx.beginPath(); 
		if(font != null && font != undefined)
		{
			ctx.font = font;
		}
		else
		{
			ctx.font = "10px sans-serif";
		}

		if(style != null && style != undefined)
		{
			ctx.fillStyle = style;
		}
		else{
			ctx.fillStyle = "#FFF";
		}

		if(align != null && align != undefined)
		{
			ctx.textAlign = align;
		}
		else
		{
			ctx.textAlign = "start";
		}

		ctx.fillText(text,x,y);
	}

	//Prueba
	var ejemplo_grafica = {
		id_html: "pru_grafica",
		type: "AIRBONE_SOUND", 
		title: "Indice de reducción acústica (R)",
		frequencies: [50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000],
		values: [25.3,28.7,32.2,35.5,39.9,41.9,42.9,45.1,48.5,52.2,55.0,56.8,59.3,61.4,62.2,62.6,64.3,65.0,64.4,60.1,64.4],
		height: 600,
		width: 500,
	}
	var ejemplo_grafica_ln = {
		id_html: "pru_grafica_ln",
		type: "IMPACT_SOUND", 
		title: "Nivel de ruido de impactos normalizado (Ln)",
		frequencies: [50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000],
		values: [57.7,58.9,60.0,61.2,62.5,63.7,64.8,66.0,67.2,68.3,69.5,70.6,71.7,72.8,73.9,75.0,76.0,77.0,78.1,78.1,78.1],
		height: 647.2135954996,
		width: 400,
	}
	draw_graphical(ejemplo_grafica);
	draw_graphical(ejemplo_grafica_ln);
});
