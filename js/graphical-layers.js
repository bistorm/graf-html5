
class glayer_layer
{
	constructor(layer)
	{
		this.width = layer.width;
		this.style = layer.style || "CONCRETE";  //CONCRETE, GYPSUM, AIR, INSULATOR
	}
}

class glayer_wall
{
	constructor(wall)
	{
		this.id_html = wall.id_html;
		this.width = wall.width;
		this.height = wall.height;
		this.arr_layers = wall.arr_layers;
	}

	data()
	{
		var data = "";
		data += "Width: "+this.width+"\n";
		data += "Height: "+this.height+"\n";
		for(var i = 0; i < this.arr_layers.length; i++)
		{
			data += "Layer "+i+":\n";
			data += "Width: "+this.arr_layers[i].width+"\n";
		}
		return data;
	}

	draw(id_html,width,height)
	{
		var id_canvas = "canvas_"+this.id_html;
		var margin = 0.08*Math.min(height,width);
		var int_rec_height = height - 2*margin;
		var int_rec_width = width - 2*margin;

		$("#"+this.id_html).html("<canvas height='"+height+"px' width='"+width+"px' class='graphical-space' id='"+id_canvas+"'>Browser does not support canvas</canvas>");	 
		
		var total_layer_width = total_layer_width(this.arr_layers);

		var acu_layer_width = 0;

		for(var i = 0; i<this.arr_layers.length; i++)
		{
			var rel_layer_width = this.arr_layers[i].width / total_layer_width;

			var fill_style = layer_style(this.arr_layers[i]);

			if(this.arr_layers[i].style != "AIR")
			{
				icanvas_draw_rectangle(id_canvas, acu_layer_width+margin, margin, rel_layer_width*int_rec_width, int_rec_height, fill_style, null, null);	
			}

			acu_layer_width += rel_layer_width*int_rec_width;
		}


		function total_layer_width(arr_layers)
		{
			var total_layer_width = 0;

			for(var i = 0; i<arr_layers.length; i++)
			{
				total_layer_width += arr_layers[i].width;
			}

			return total_layer_width;
		}

		function layer_style(layer)
		{
			var fill_style = "";
			switch(layer.style)
			{
				case "CONCRETE":
					fill_style = "rgb(241,241,241)";
				break;
				case "GYPSUM":
					fill_style = "rgb(255,255,255)";
				break;
				case "INSULATOR":
					fill_style = "rgb(250,250,147)";
				break;
			}
			return fill_style;
		}
	}
}

$(document).ready(function(){
	var capa1 = new glayer_layer({
		width: 3,
		style: "GYPSUM",
	});

	var capa2 = new glayer_layer({
		width: 5,
		style: "AIR",
	});

	var capa3 = new glayer_layer({
		width: 50,
		style: "CONCRETE",
	});

	var capa4 = new glayer_layer({
		width: 7,
		style: "INSULATOR",
	});

	var capa5 = new glayer_layer({
		width: 10,
		style: "GYPSUM",
	});

	var wall = new glayer_wall({
		id_html: "pru_wall",
		width: 20,
		height: 120,
		arr_layers: [capa1,capa2,capa3,capa4,capa5],
	});
	//alert(wall.data());
	wall.draw("pru_wall",300,300);
});