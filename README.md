##Overview
A Tetris game made by troy. 

##Tetromino Design
<style>
table i{display:inline-block;width:10px;height:10px;font-style: normal;background:gray;margin:1px;}
table i.core{background:red;}
table i.l{margin-left:-10px;}
table i.l2{margin-left:-20px;}
table i.r{margin-left:13px;}
table i.r2{margin-left:26px;}
</style>
| TYPE | Shape 1 | Shape 2 | Shape 3 | Shape 4 |
|:----:|:-------:|:---:|:-----:|:-----:|
| O | <i></i><i></i><br><i></i><i class="core"></i> |
| I | <i></i><br><i></i><br><i class="core"></i><br><i></i> | <i></i><i></i><i class="core"></i><i></i> |
| S | <i class="l"></i><br><i></i><i class="core"></i><br><i class="r"></i> | <i class="r"></i><i></i><br><i class="l"></i><i class="core"></i> |
| Z | <i class="r"></i><br><i></i><i class="core"></i><br><i class="l"></i> | <i class="l"></i><i></i><br><i class="r"></i><i class="core"></i> |
| L | <i></i><i></i><br><i class="core r"></i><br><i class="r"></i> | <i class="r2"></i><br><i></i><i class="core"></i><i></i> | <i class="l"></i><br><i class="core l"></i><br><i></i><i></i> | <i></i><i class="core"></i><i></i><br><i class="l2"></i> |
| J | <i></i><i></i><br><i class="core l"></i><br><i class="l"></i> | <i></i><i class="core"></i><i></i><br><i class="r2"></i> | <i class="r"></i><br><i class="core r"></i><br><i></i><i></i> | <i class="l2"></i><br><i></i><i class="core"></i><i></i> |
| T | <i></i><br><i></i><i class="core"></i><i></i> | <i class="l"></i><br><i></i><i class="core"></i><br><i class="l"></i> | <i></i><i class="core"></i><i></i><br><i></i> | <i class="r"></i><br><i></i><i class="core"></i><br><i class="r"></i> |
*Attention: the red blocks is the center of tetromino while transforming.
In other words, the position of red blocks are `[0, 0]`.
