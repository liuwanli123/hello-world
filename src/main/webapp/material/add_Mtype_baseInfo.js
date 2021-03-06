Ext.define('material.add_Mtype_baseInfo', {
    extend : 'Ext.panel.Panel',
    region : 'center',
    layout : "fit",
    title : '新增原材料类型基础信息',
    reloadPage : function() {
        var p = Ext.getCmp('functionPanel');
        p.removeAll();
        cmp = Ext.create("material.add_Mcatergory_baseInfo");
        p.add(cmp);
    },
    clearGrid : function() {
        var msgGrid = Ext.getCmp("msgGrid");
        if (msgGrid != null || msgGrid != undefined)
            this.remove(msgGrid);
    },

    initComponent : function() {
        var me = this;
        //定义表名
        var tableName="material_type";
        // var materialtype="0";
        var toolbar2 = Ext.create("Ext.toolbar.Toolbar", {
            dock : "top",
            items : [{
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '新增类型',
                handler : function() {
                    //fields: ['品号', '品名','规格','库存单位','仓库编号','数量','成本','存放位置']
                    var data = [{
                        'typeName':'',
                    }];
                    //Ext.getCmp('addTypeGrid')返回定义的对象
                    Ext.getCmp('addTypeGrid').getStore().loadData(data,
                        true);

                }

            }, {
                xtype : 'button',
                iconAlign : 'center',
                iconCls : 'rukuicon ',
                text : '保存',

                handler : function() {
                    // 取出grid的字段名字段类型
                    //var userid="<%=session.getAttribute('userid')%>";
                    var select = Ext.getCmp('addTypeGrid').getStore()
                        .getData();
                    var s = new Array();
                    select.each(function(rec) {
                        //delete rec.data.id;
                        s.push(JSON.stringify(rec.data));
                        //alert(JSON.stringify(rec.data));//获得表格中的数据
                    });
                    //alert(s);//数组s存放表格中的数据，每条数据以json格式存放

                    Ext.Ajax.request({
                        url : 'material/insertIntoMaterialType.do', //HandleDataController
                        method:'POST',
                        //submitEmptyText : false,
                        params : {
                            tableName:tableName,
                            // materialType:materialtype,
                            s : "[" + s + "]",
                            //userid: userid + ""
//									tableName : tabName,
//									organizationId : organizationId,
//									tableType : tableType,
//									uploadCycle : uploadCycle,
//									cycleStart : cycleStart

                        },
                        success : function(response) {
                            Ext.MessageBox.alert("提示", "录入成功！");

                            // me.close();
//									var obj = Ext.decode(response.responseText);
//									if (obj) {
//
//										Ext.MessageBox.alert("提示", "保存成功！");
//										me.close();
//
//									} else {
//										// 数据库约束，返回值有问题
//										Ext.MessageBox.alert("提示", "保存失败！");
//
//									}

                        },
                        failure : function(response) {
                            Ext.MessageBox.alert("提示", "录入失败！");
                        }
                    });

                }
            }]
        });

        var MtypeStore = Ext.create('Ext.data.Store',{
            //id,materialName,length,width,materialType,number
            fields:[],
            proxy : {
                type : 'ajax',
                url : 'material/findAllBytableName.do?tableName='+tableName,//获取同类型的原材料  +'&pickNum='+pickNum
                reader : {
                    type : 'json',
                    rootProperty: 'material_type',
                },
                // params: {
                //     tableName:'material_type'
                // }
            },
            autoLoad : true
        });

        var grid = Ext.create("Ext.grid.Panel", {
            id : 'addTypeGrid',
            dockedItems : [toolbar2],
            store : MtypeStore,
            columns : [
                {dataIndex : 'typeName', text : '原材料类型', width :300, editor : {xtype : 'textfield', allowBlank : false,}},
                {dataIndex : 'materialPrefix', text : '品号前缀', width :300, editor : {xtype : 'textfield', allowBlank : false,}},
                {
                    xtype:'actioncolumn',
                    text : '删除操作',
                    width:100,
                    style:"text-align:center;",
                    items: [
                        //删除按钮
                        {
                            icon: 'extjs/imgs/delete.png',
                            tooltip: 'Delete',
                            style:"margin-right:20px;",
                            handler: function(grid, rowIndex, colIndex) {
                                var rec = grid.getStore().getAt(rowIndex);
                                console.log("删除--------：",rec.data.typeName)
                                console.log("删除--------：",rec.data.id)
                                //类型id
                                var typeId = rec.data.id;
                                //弹框提醒
                                Ext.Msg.show({
                                    title: '操作确认',
                                    message: '将删除数据，选择“是”否确认？',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.Msg.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                url:"data/EditCellById.do",  //EditDataById.do
                                                params:{
                                                    type:'delete',
                                                    tableName:tableName,
                                                    field:'typeName',
                                                    value:rec.data.typeName,
                                                    id:typeId
                                                },
                                                success:function (response) {
                                                    Ext.MessageBox.alert("提示", "删除成功!");
                                                    Ext.getCmp('addTypeGrid').getStore().remove(rec);
                                                },
                                                failure : function(response){
                                                    Ext.MessageBox.alert("提示", "删除失败!");
                                                }
                                            })
                                        }
                                    }
                                });
                                // alert("Terminate " + rec.get('firstname'));
                            }
                        }]

                }
                 ],
            viewConfig : {
                plugins : {
                    ptype : "gridviewdragdrop",
                    dragText : "可用鼠标拖拽进行上下排序"
                }
            },
            plugins : [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1
            })],
            selType : 'rowmodel',
            listeners: {
                //监听修改
                validateedit: function (editor, e) {
                    var id=e.record.data.id
                    //修改的字段
                    var field=e.field;
                    //修改的值
                    var newV = e.value;
                    Ext.Ajax.request({
                        url:"data/EditCellById.do",  //EditDataById.do
                        params:{
                            type:'edit',
                            tableName:tableName,
                            field:field,
                            value:newV,
                            id:id
                        },
                        success:function (response) {
                            Ext.MessageBox.alert("提示","修改成功" );
                            //重新加载
                            Ext.getCmp('addTypeGrid').getStore().load();
                        },
                        failure:function (response) {
                            Ext.MessageBox.alert("提示","修改失败" );
                        }
                    })
                }
            }
        });

        this.dockedItems = [ grid];//toolbar2,
        //this.items = [ me.grid ];
        this.callParent(arguments);

    }

})

