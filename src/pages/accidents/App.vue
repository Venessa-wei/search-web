<template>
  <div id="app">
    <!-- 如果搜索结果不为空 -->
    <div
      v-if="hd_data.length === 0 && content_data.length === 0 && beforeSearchFlag"
    >
      <div class="center-title">
        事故定向检查和关联事故搜索
      </div>
      <div style="margin: 0 auto 20px auto; width: 1000px">
        <div class="title">
          事故定向检查入口：
          <i-button
            type="warning"
            @click="specialCheckEntrance(0)"
            icon="ios-open-outline"
            size="large"
          >
            事故定向检查
          </i-button>
        </div>
      </div>
      <div style="margin: 0 auto 20px auto; width: 1000px">
        <p class="title">
          事故专项检查入口：
          <i-button
            type="success"
            @click="specialCheckEntrance(1)"
            icon="ios-open-outline"
            size="large"
          >
            事故专项检查</i-button
          >
        </p>
      </div>
      <div style="margin: auto; width: 1000px">
        <p class="title">事故搜索入口：</p>
        <i-input
          v-model="searchValue"
          search
          enter-button
          @on-search="searchAccident"
          placeholder="请输入事故或隐患描述"
          size="large"
        ></i-input>
        <Collapse simple v-show="!accurate">
          <Panel name="1">
            高级搜索
            <div class="content">
              <Row>
                <i-col span="18">
                  <p>关键词</p>
                </i-col>
                <i-col span="3" offset="1">
                  <p>权重(1-10)</p>
                </i-col>
              </Row>
              <p
                v-for="(item,index) in searchText"
                :key="index"
              >
                <Row>
                  <i-col span="18">
                    <i-input
                      v-model="item.text"
                    ></i-input>
                  </i-col>
                  <i-col span="2" offset="1">
                    <input-number
                      :max="10"
                      :min="1"
                      v-model="item.weight"
                    ></input-number>
                  </i-col>
                  <i-col span="2" offset="1">
                    <i-button
                      type="warning"
                      shape="circle"
                      icon="md-remove"
                      @click="removeItem(index)"
                    ></i-button>
                  </i-col>
                </Row>
              </p>
              <i-button
                type="primary"
                long
                @click="createNewKey"
                icon="md-add-circle"
              >添加关键词权重</i-button
              >
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
    <div v-else>
      <div
        style="
                        margin: 10px auto 10px auto;
                        width: 500px;
                        text-align: center;
                        font-size: 20px;
                        font-weight: bold;
                    "
      >
        专项排查和事故搜索界面
      </div>

      <Row>
        <i-col span="10" offset="1">
          <i-input
            v-model="searchValue"
            search
            enter-button
            @on-search="searchAccident"
            placeholder="请输入事故或隐患描述"
          ></i-input>
          <Collapse simple v-show="!accurate">
            <Panel name="1">
              高级搜索
              <div class="content">
                <Row>
                  <i-col span="18">
                    <p>关键词</p>
                  </i-col>
                  <i-col span="4" offset="1">
                    <p>权重(1-10)</p>
                  </i-col>
                </Row>
                <p
                  v-for="(item,index) in searchText"
                  :key="index"
                >
                  <Row>
                    <i-col span="18">
                      <i-input
                        v-model="item.text"
                      ></i-input>
                    </i-col>
                    <i-col span="2" offset="1">
                      <input-number
                        :max="10"
                        :min="1"
                        v-model="item.weight"
                      ></input-number>
                    </i-col>
                    <i-col span="2" offset="1">
                      <i-button
                        type="warning"
                        shape="circle"
                        icon="md-remove"
                        @click="removeItem(index)"
                      ></i-button>
                    </i-col>
                  </Row>
                </p>
                <i-button
                  type="primary"
                  long
                  @click="createNewKey"
                  icon="md-add-circle"
                >添加关键词权重
                </i-button>
              </div>
            </Panel>
          </Collapse>
        </i-col>
        <i-col span="3" offset="1">
          <span>精确查找:</span>
          <i-switch v-model="accurate" size="large">
            <div class="open">
              <span>开启</span>
            </div>
            <div class="close">
              <span>关闭</span>
            </div>
          </i-switch>
        </i-col>
        <i-col span="3">
          <span>高亮结果:</span>
          <i-switch v-model="highlightStyle" size="large">
            <div class="open">
              <span>开启</span>
            </div>
            <div class="close">
              <span>关闭</span>
            </div>
          </i-switch>
        </i-col>
        <i-col span="3">
          <i-button
            type="warning"
            @click="specialCheckEntrance(0)"
            icon="ios-open-outline"
          >事故定向检查</i-button
          >
        </i-col>

        <i-col span="3">
          <i-button
            type="success"
            @click="specialCheckEntrance(1)"
            icon="ios-open-outline"
          >事故专项检查</i-button
          >
        </i-col>
      </Row>

      <!-- 左右分割面板 -->
      <div class="result-split">
        <Split v-model="split">
          <div class="right">
            <div class="result-split-pane">
              <div>
                <p class="search_card title">基于事故经过搜索：</p>
                <div
                  v-for="(item, index) in content_data"
                  :key="index"
                >
                  <Row>
                    <i-col span="4">
                      <p
                        v-if="item.score > 4"
                        class="high_score"
                      >
                        {{item.score.toFixed(3)}}
                      </p>
                      <p v-else class="low_score">
                        {{item.score.toFixed(3)}}
                      </p>
                    </i-col>
                    <i-col span="13">
                      <a
                        @click="showDetail(item)"
                        class="title"
                      >{{item.title}}</a
                      >
                    </i-col>
                    <i-col span="7">
                      <p class="low_title">
                        {{item.date}}
                      </p>
                    </i-col>
                  </Row>
                  <div v-if="highlightStyle">
                    <p
                      v-for="(content, idx) in item.highlight.content"
                      :key="idx"
                      v-html="content + '<span>...</span>'"
                      v-if="idx < 2"
                    ></p>
                  </div>
                  <div v-else>
                    {{item.content.slice(0,150)}}
                    <span>...</span>
                  </div>
                  <Divider />
                </div>
              </div>

              <div v-if="content_recommend.length > 0">
                <p class="title search_card">相似事故推荐：</p>
                <div
                  v-for="(item, index) in content_recommend"
                  :key="index"
                >
                  <Row>
                    <i-col span="4">
                      <p
                        v-if="item.score > 4"
                        class="high_score"
                      >
                        {{item.score.toFixed(3)}}
                      </p>
                      <p v-else class="low_score">
                        {{item.score.toFixed(3)}}
                      </p>
                    </i-col>
                    <i-col span="13">
                      <a
                        @click="showDetail(item)"
                        class="title"
                      >{{item.title}}</a
                      >
                    </i-col>
                    <i-col span="7">
                      <p class="low_title">
                        {{item.date}}
                      </p>
                    </i-col>
                  </Row>
                  <div v-if="highlightStyle">
                    <p
                      v-for="(content, idx) in item.highlight.content"
                      :key="idx"
                      v-html="content + '<span>...</span>'"
                      v-if="idx < 2"
                    ></p>
                  </div>
                  <div v-else>
                    {{item.content.slice(0,150)}}
                    <span>...</span>
                  </div>
                  <Divider />
                </div>
              </div>
            </div>
          </div>
          <div class="left">
            <div class="result-split-pane">
              <div >
                <p class="title search_card">基于事故隐患搜索：</p>
                <div
                  v-for="(item, index) in hd_data"
                  :key="index"
                >
                  <Row>
                    <i-col span="2">
                      <p
                        v-if="item.score > 4"
                        class="high_score"
                      >
                        {{item.score.toFixed(3)}}
                      </p>
                      <p v-else class="low_score">
                        {{item.score.toFixed(3)}}
                      </p>
                    </i-col>
                    <i-col span="14" offset="1">
                      <a
                        @click="showDetail(item)"
                        class="title"
                      >{{item.title}}</a
                      >
                    </i-col>
                    <i-col span="7">
                      <p class="low_title">
                        {{item.date}}
                      </p>
                    </i-col>
                  </Row>
                  <div v-if="highlightStyle">
                    <p
                      v-for="(content, idx) in item.highlight.hd"
                      :key="idx"
                      v-html="content + '<span>...</span>'"
                      v-if="idx < 2"
                    ></p>
                  </div>
                  <div v-else>
                    {{item.content.slice(0,300)}}
                    <span>...</span>
                  </div>
                  <Divider />
                </div>
              </div>

              <div v-if="hd_recommend.length > 0">

                <p class="title search_card">相似事故推荐：</p>
                <div
                  v-for="(item, index) in hd_recommend"
                  :key="index"
                >
                  <Row>
                    <i-col span="2">
                      <p
                        v-if="item.score > 4"
                        class="high_score"
                      >
                        {{item.score.toFixed(3)}}
                      </p>
                      <p v-else class="low_score">
                        {{item.score.toFixed(3)}}
                      </p>
                    </i-col>
                    <i-col span="14" offset="1">
                      <a
                        @click="showDetail(item)"
                        class="title"
                      >{{item.title}}</a
                      >
                    </i-col>
                    <i-col span="7">
                      <p class="low_title">
                        {{item.date}}
                      </p>
                    </i-col>
                  </Row>
                  <div v-if="highlightStyle">
                    <p
                      v-for="(content, idx) in item.highlight.hd"
                      :key="idx"
                      v-html="content + '<span>...</span>'"
                      v-if="idx < 2"
                    ></p>
                  </div>
                  <div v-else>
                    {{item.content.slice(0,300)}}
                    <span>...</span>
                  </div>
                  <Divider />
                </div>
              </div>

            </div>
          </div>
        </Split>
      </div>
    </div>

    <!-- 事故详细信息展示 -->
    <Drawer
      :width="100"
      v-model="detailDrawer"
      title="事故详情"
      placement="left"
      scrollable
      :mask-closable="false"
    >
      <div v-if="preData !== {}">
        <Row>
          <i-col :span="24/accDetailParam.item_cnt " class="vertical_split">
            <Row>
              <i-col span="4">
                <p
                  v-if="preData.score > 4"
                  class="high_score"
                >
                  {{preData.score.toFixed(3)}}
                </p>
                <p v-else class="low_score">
                  {{preData.score.toFixed(3)}}
                </p>
              </i-col>
              <i-col span="12" offset="1" class="title">
                <p>{{preData.title}}</p>
              </i-col>
              <i-col span="7">
                <p class="low_title">{{preData.date}}</p>
              </i-col>
            </Row>

            <p v-if="preData.intro !== ''">
              <span class="low_title">信息简介</span>
              {{preData.intro}}
            </p>
            <p v-if="preData.content !== ''">
              <span class="low_title">事故经过</span>
              <!-- <t v-for="(item,idx) in content_view" :key="idx" :class="item.view">
      {{item.text}}
  </t> -->

              <Timeline style="margin-top: 10px">
                <timeline-item
                  v-for="(content, idx) in preData.content.split('\n')"
                  :key="idx"
                >
                  {{content}}
                </timeline-item>
              </Timeline>
              <!-- {{preData.content}} -->
            </p>
          </i-col>

          <i-col
            :span="24/accDetailParam.item_cnt - 1"
            v-if="preData.dangers.length > 0"
            class="vertical_split"
          >
            <p>
              <i-button
                type="primary"
                @click="showFaultTree(nowAcci_aid)"
                icon="ios-git-branch"
              >查看事故树
              </i-button>
              <i-button
                type="warning"
                @click="showOriAccList(nowAcci_aid)"
                icon="ios-open-outline"
              >定向检查
              </i-button>
              <i-button
                type="success"
                @click="showSpeAccList(nowAcci_aid)"
                icon="ios-open-outline"
              >专项检查
              </i-button>
            </p>
            <t class="low_title">参考隐患样例</t>

            <div v-for="(danger, idx) in preData.dangers" @click="showDangerDetail(idx)" :key="idx">
              <p
                v-if="idx === accDetailParam.dangerIndex"
                class="dangers_card"
              >
                <span style="color: blue">{{idx+1}}、</span>
                <span v-if="danger.event_code.length > 0"
                >事故树节点{{danger.event_code.join('、')}}。</span
                >
                <span v-else>事故树节点：暂无</span>
                <br />
                {{danger.hidden_danger}}
              </p>
              <p v-else class="ord_dangers_card">
                <span style="color: blue">{{idx+1}}、</span>
                <span v-if="danger.event_code.length > 0"
                >事故树节点：{{danger.event_code.join('、')}}。</span
                >
                <span v-else>事故树节点：暂无</span>
                <br />
                {{danger.hidden_danger}}
              </p>
            </div>
          </i-col>
          <i-col
            style="margin-top: 30px"
            :span="24/accDetailParam.item_cnt -1"
            v-if="0 <= accDetailParam.dangerIndex && accDetailParam.dangerIndex < preData.dangers.length"
          >
            <t class="low_title">隐患详细内容</t>
            <div class="dangers_card" style="margin-top: 10px">
              <i-button
                type="primary"
                @click="showSubFaultTree(nowAcci_aid, preData.dangers[accDetailParam.dangerIndex].hd_id)"
              >
                查看隐患事故子树</i-button
              >
              <Row>
                <i-col :span="7" style="text-align: center">
                  <p class="dangers_title">关联程度</p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '极高'"
                    style="
                                                background-color: #c00000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '高'"
                    style="
                                                background-color: #c00000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '较高'"
                    style="
                                                background-color: #ff0000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>

                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '中'"
                    style="
                                                background-color: #ffc000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '中度'"
                    style="
                                                background-color: #ffc000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '中等'"
                    style="
                                                background-color: #ffc000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '关联'"
                    style="
                                                background-color: #ffc000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>

                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '一般'"
                    style="
                                                background-color: #ffff00;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].association === '较弱'"
                    style="
                                                background-color: #0070c0;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>

                  <p style="font-weight: bold">
                    {{preData.dangers[accDetailParam.dangerIndex].association}}
                  </p>
                </i-col>
                <i-col
                  :span="7"
                  offset="1"
                  style="text-align: center"
                >
                  <p class="dangers_title">
                    潜在事故等级
                  </p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].level === '重大'"
                    style="
                                                background-color: #ff0000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].level === '较大'"
                    style="
                                                background-color: #ffc000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].level === '一般'"
                    style="
                                                background-color: #ffff00;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].level === '无法确定'"
                    style="
                                                background-color: #7030a0;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>

                  <p style="font-weight: bold">
                    {{preData.dangers[accDetailParam.dangerIndex].level}}
                  </p>
                </i-col>
                <i-col
                  :span="7"
                  offset="1"
                  style="text-align: center"
                >
                  <p class="dangers_title">
                    潜在事故状态
                  </p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].criticality === '险兆'"
                    style="
                                                background-color: #c00000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].criticality === '征兆'"
                    style="
                                                background-color: #ff0000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].criticality === '萌芽'"
                    style="
                                                background-color: #ffc000;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].criticality === '关联'"
                    style="
                                                background-color: #ffff00;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>
                  <p
                    v-if="preData.dangers[accDetailParam.dangerIndex].criticality === '弱联'"
                    style="
                                                background-color: #0070c0;
                                                display: inline-block;
                                                width: 50px;
                                                height: 30px;
                                                padding: 5px;
                                                border: 1px solid;
                                            "
                  ></p>

                  <p style="font-weight: bold">
                    {{preData.dangers[accDetailParam.dangerIndex].criticality}}
                  </p>
                </i-col>
              </Row>
              <br />
              <div>
                <t class="dangers_title">对应事故树节点</t>
                <p
                  v-if="preData.dangers[accDetailParam.dangerIndex].event_code.length > 0"
                >
                  {{preData.dangers[accDetailParam.dangerIndex].event_code.join('、')}}
                </p>
                <p v-else>暂无</p>
              </div>
              <div>
                <t class="dangers_title">隐患内容</t>
                <p>
                  {{preData.dangers[accDetailParam.dangerIndex].hidden_danger}}
                </p>
              </div>
              <div>
                <t class="dangers_title">建议措施</t>
                <p
                  v-if="preData.dangers[accDetailParam.dangerIndex].suggestion === null || preData.dangers[accDetailParam.dangerIndex].suggestion.length === 0"
                >
                  暂无
                </p>
                <div
                  v-else
                  v-for="(item, idx) in preData.dangers[accDetailParam.dangerIndex].suggestion"
                  :key="idx"
                >
                  <p style="font-weight: bold">
                    {{item.aspectName}}：
                  </p>
                  <p
                    v-for="(suggestion, s_idx) in item.suggestion"
                    :key="s_idx"
                    style="margin-left: 2em"
                  >
                    <span style="color: blue"
                    >{{s_idx+1}}、</span
                    >
                    {{suggestion}}；
                  </p>
                </div>
              </div>
            </div>
          </i-col>
        </Row>
      </div>
    </Drawer>

    <!-- 专项检查入口 -->
    <Modal
      :width="600"
      v-model="accidentCheck.modal"
      title="选择历史事故"
      :footer-hide="true"
      :mask-closable="false"
    >
      <!-- <i-input search enter-button @on-search="searchAccidentName" placeholder="请输入事故名称"></i-input> -->
      <p v-for="(item, idx) in accidentCheck.list" :key="idx">
        {{idx + 1}}、<i-button
        type="text"
        @click="showSpecialCheckDetail(idx)"
      >
        {{item.name}}
        <Icon type="md-open" />
      </i-button>
      </p>
    </Modal>

    <!-- 事故定向检查填表 -->
    <Modal
      v-model="oriCheckParam.checkListDrawer"
      :title="oriCheckParam.check_list.name"
      footer-hide="true"
      sticky
      fullscreen
    >
      <Row>
        <!-- 填专项检查表 -->
        <i-col
          :span="(oriCheckParam.item_cnt === 1? 12 : 24 / oriCheckParam.item_cnt)"
          class="vertical_split"
        >
          <div style="margin-bottom: 10px; margin-left: 20px">
            <p>
              <i-button
                type="primary"
                @click="showFaultTree(nowAcci_aid)"
                icon="ios-git-branch"
              >查看事故树
              </i-button>
            </p>
            <i-form
              ref="oriCheckForm"
              :model="oriCheckParam"
              label-width="250"
              label-position="left"
            >
              <form-item
                v-for="(checked_item,idx) in oriCheckParam.checked_list"
                :key="idx"
                :label="idx+1 + '、' + oriCheckParam.check_list.content[idx].checkItem"
                :prop="'checked_list.' + idx + '.checked'"
                :rules="{required: true, message:'内容不能为空', trigger: 'blur'}"
              >
                <i-select v-model="checked_item.checked">
                  <option-group
                    v-for="(g_name, g_idx) in Object.keys(oriCheckParam.check_list.content[idx].options)"
                    :key="g_idx"
                    :label="g_name"
                  >
                    <i-option
                      v-for="(opt, opt_idx) in oriCheckParam.check_list.content[idx].options[g_name]"
                      :value="opt"
                      :key="opt_idx"
                    >{{ opt }}</i-option
                    >
                  </option-group>
                </i-select>
              </form-item>
            </i-form>

            <Row style="margin-top: 20px">
              <i-col span="5">
                <p>模板类型</p>
              </i-col>
              <i-col span="6">
                <i-select v-model="oriCheckParam.modelType">
                  <i-option value="1">模板1</i-option>
                  <i-option value="2">模板2</i-option>
                </i-select>
              </i-col>
              <i-col span="12" offset="1">
                <i-button
                  type="primary"
                  @click="procOriCheckList(oriCheckParam.modelType, 'oriCheckForm')"
                >生成描述</i-button
                >
              </i-col>
            </Row>
            <Row style="margin-top: 10px">
              <i-col
                span="12"
                v-if="oriCheckParam.association !== ''"
              >
                                    <span
                                      class="low_title"
                                      style="text-align: right"
                                    >关联程度</span
                                    >
                <span
                  v-if="oriCheckParam.association === '强关联'"
                  style="
                                            background-color: #c00000;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            border: 1px solid;
                                        "
                ></span>
                <span
                  v-if="oriCheckParam.association === '关联'"
                  style="
                                            background-color: #ff0000;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            border: 1px solid;
                                        "
                ></span>
                <span
                  v-if="oriCheckParam.association === '弱联'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            border: 1px solid;
                                        "
                ></span>
                <span
                  v-if="oriCheckParam.association === '不关联'"
                  style="
                                            background-color: #0070c0;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            border: 1px solid;
                                        "
                ></span>
                <span style="font-weight: bold"
                >{{oriCheckParam.association}}</span
                >
              </i-col>
              <i-col
                span="12"
                v-if="oriCheckParam.criticality !== ''"
              >
                                    <span
                                      class="low_title"
                                      style="text-align: right"
                                    >预警程度</span
                                    >
                <span
                  v-if="oriCheckParam.criticality === '险兆'"
                  style="
                                            background-color: #c00000;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></span>
                <span
                  v-if="oriCheckParam.criticality === '征兆'"
                  style="
                                            background-color: #ff0000;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></span>
                <span
                  v-if="oriCheckParam.criticality === '萌芽'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></span>
                <span
                  v-if="oriCheckParam.criticality === '无预警'"
                  style="
                                            background-color: #0070c0;
                                            display: inline-block;
                                            width: 30px;
                                            height: 30px;
                                            border: 1px solid;
                                        "
                ></span>
                <span style="font-weight: bold"
                >{{oriCheckParam.criticality}}</span
                >
              </i-col>
            </Row>
            <div
              class="check_card"
              v-if="oriCheckParam.checkDescription !== ''"
            >
              <t class="low_title">检查报告</t>
              <p v-html="oriCheckParam.checkDescription"></p>
            </div>
            <div
              class="check_card"
              v-if="oriCheckParam.checkDescription !== ''"
            >
              <t class="low_title">建议措施</t>
              <p
                style="margin-left: 20px"
                v-html="oriCheckParam.checkSuggestion"
              ></p>
            </div>
          </div>
        </i-col>
        <!-- 搜索关联隐患 -->
        <i-col
          :span="24 / oriCheckParam.item_cnt -1 "
          v-if="oriCheckParam.dangers.length > 0"
          class="vertical_split"
        >
          <t class="low_title">相似隐患推荐</t>
          <div
            v-for="(danger, idx) in oriCheckParam.dangers"
            @click="showDangerDetail(idx, type=1)"
            :key="idx"
          >
            <p
              v-if="idx === oriCheckParam.dangerIndex"
              class="dangers_card"
            >
              <span style="color: blue">{{idx+1}}、</span>
              <span v-if="danger.event_code.length > 0"
              >事故树节点：{{danger.event_code.join('、')}}。</span
              >
              <span v-else>事故树节点：暂无</span>
              <br />
              {{danger.hidden_danger}}
            </p>
            <p v-else class="ord_dangers_card">
              <span style="color: blue">{{idx+1}}、</span>
              <span v-if="danger.event_code.length > 0"
              >事故树节点：{{danger.event_code.join('、')}}。</span
              >
              <span v-else>事故树节点：暂无</span>
              <br />
              {{danger.hidden_danger}}
            </p>
          </div>
        </i-col>
        <!-- 查看隐患详情 -->
        <i-col
          :span="24 / oriCheckParam.item_cnt - 1"
          v-if="0 <= oriCheckParam.dangerIndex && oriCheckParam.dangerIndex < oriCheckParam.dangers.length"
        >
          <t class="low_title">隐患详细内容</t>
          <div class="dangers_card" style="margin-top: 5px">
            <i-button
              type="primary"
              @click="showSubFaultTree(nowAcci_aid, oriCheckParam.dangers[oriCheckParam.dangerIndex].hd_id)"
            >
              查看隐患事故子树</i-button
            >
            <Row>
              <i-col :span="7" style="text-align: center">
                <p class="dangers_title">关联程度</p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '极高'"
                  style="
                                            background-color: #c00000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '高'"
                  style="
                                            background-color: #c00000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '较高'"
                  style="
                                            background-color: #ff0000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>

                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '中'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '中度'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '中等'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '关联'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>

                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '一般'"
                  style="
                                            background-color: #ffff00;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].association === '较弱'"
                  style="
                                            background-color: #0070c0;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>

                <p style="font-weight: bold">
                  {{oriCheckParam.dangers[oriCheckParam.dangerIndex].association}}
                </p>
              </i-col>
              <i-col
                :span="7"
                offset="1"
                style="text-align: center"
              >
                <p class="dangers_title">潜在事故等级</p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].level === '重大'"
                  style="
                                            background-color: #ff0000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].level === '较大'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].level === '一般'"
                  style="
                                            background-color: #ffff00;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].level === '无法确定'"
                  style="
                                            background-color: #7030a0;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>

                <p style="font-weight: bold">
                  {{oriCheckParam.dangers[oriCheckParam.dangerIndex].level}}
                </p>
              </i-col>
              <i-col
                :span="7"
                offset="1"
                style="text-align: center"
              >
                <p class="dangers_title">潜在事故状态</p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].criticality === '险兆'"
                  style="
                                            background-color: #c00000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].criticality === '征兆'"
                  style="
                                            background-color: #ff0000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].criticality === '萌芽'"
                  style="
                                            background-color: #ffc000;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].criticality === '关联'"
                  style="
                                            background-color: #ffff00;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>
                <p
                  v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].criticality === '弱联'"
                  style="
                                            background-color: #0070c0;
                                            display: inline-block;
                                            width: 50px;
                                            height: 30px;
                                            padding: 5px;
                                            border: 1px solid;
                                        "
                ></p>

                <p style="font-weight: bold">
                  {{oriCheckParam.dangers[oriCheckParam.dangerIndex].criticality}}
                </p>
              </i-col>
            </Row>
            <br />
            <div>
              <t class="dangers_title">对应事故树节点</t>
              <p
                v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].event_code.length > 0"
              >
                {{oriCheckParam.dangers[oriCheckParam.dangerIndex].event_code.join('、')}}
              </p>
              <p v-else>暂无</p>
            </div>
            <div>
              <t class="dangers_title">隐患内容</t>
              <p>
                {{oriCheckParam.dangers[oriCheckParam.dangerIndex].hidden_danger}}
              </p>
            </div>
            <div>
              <t class="dangers_title">建议措施</t>
              <p
                v-if="oriCheckParam.dangers[oriCheckParam.dangerIndex].suggestion === null || oriCheckParam.dangers[oriCheckParam.dangerIndex].suggestion.length === 0"
              >
                暂无
              </p>
              <div
                v-else
                v-for="(item, idx) in oriCheckParam.dangers[oriCheckParam.dangerIndex].suggestion"
                :key="idx"
              >
                <p style="font-weight: bold">
                  {{item.aspectName}}：
                </p>
                <p
                  v-for="(suggestion, s_idx) in item.suggestion"
                  :key="s_idx"
                  style="margin-left: 2em"
                >
                                        <span style="color: blue"
                                        >{{s_idx+1}}、</span
                                        >
                  {{suggestion}}；
                </p>
              </div>
            </div>
          </div>
        </i-col>
      </Row>
    </Modal>

    <!-- 事故专项检查填表 -->
    <Modal
      v-model="speCheckParam.checkListDrawer"
      :title="speCheckParam.check_list.name"
      footer-hide="true"
      sticky
      fullscreen
    >
      <Row>
        <!-- 填专项检查表 -->
        <!-- <i-col :span="(speCheckParam.item_cnt === 1? 12 : 24 / speCheckParam.item_cnt)"> -->
        <i-col :span="16" class="vertical_split">
          <div style="margin-bottom: 10px; margin-left: 20px">
            <p>
              <i-button
                type="primary"
                @click="showFaultTree(nowAcci_aid)"
                icon="ios-git-branch"
              >查看事故树
              </i-button>
            </p>
            <i-form
              :model="speCheckParam.check_list.content"
              label-width="650"
              label-position="left"
            >
              <Collapse simple accordion v-model="collValue">
                <Panel
                  v-for="(check_class, class_idx) in speCheckParam.check_list.content"
                  :key="class_idx"
                >
                                        <span style="font-weight: bold"
                                        >检查类{{class_idx+1}}：{{check_class.name}}</span
                                        >
                  <div class="content">
                    <form-item
                      v-for="(check_item,idx) in check_class.content"
                      :key="idx"
                      :label="idx+1 + '、【' + check_item.node + '】' + check_item.checkItem + '？'"
                    >
                                                <span
                                                  v-if="check_item.options.length > 2"
                                                >
                                                    <i-select
                                                      v-model="check_item.option"
                                                    >
                                                        <i-option
                                                          v-for="(opt, opt_idx) in check_item.options"
                                                          :key="opt_idx"
                                                          :value="opt"
                                                        >{{ opt }}</i-option
                                                        >
                                                    </i-select>
                                                </span>
                      <span v-else>
                                                    <radio-group
                                                      v-model="check_item.option"
                                                    >
                                                        <Radio
                                                          v-for="(opt, opt_idx) in check_item.options"
                                                          :key="opt_idx"
                                                          :label="opt"
                                                        >{{ opt }}</Radio
                                                        >
                                                    </radio-group>
                                                </span>
                    </form-item>
                  </div>
                </Panel>
              </Collapse>
            </i-form>
          </div>
        </i-col>
        <i-col :span="7">
          <div style="margin-top: 20px">
            <i-button
              type="warning"
              @click="procSpeCheckList()"
              icon="md-barcode"
            >分析隐患</i-button
            >
          </div>
          <Row style="margin-top: 10px">
            <i-col
              span="12"
              v-if="speCheckParam.association !== ''"
            >
                                <span
                                  class="low_title"
                                  style="text-align: right"
                                >关联程度</span
                                >
              <span
                v-if="speCheckParam.association === '强关联'"
                style="
                                        background-color: #c00000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '高'"
                style="
                                        background-color: #c00000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '关联'"
                style="
                                        background-color: #ff0000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '中'"
                style="
                                        background-color: #ff0000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '弱联'"
                style="
                                        background-color: #ffc000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '一般'"
                style="
                                        background-color: #ffc000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '不关联'"
                style="
                                        background-color: #0070c0;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.association === '无'"
                style="
                                        background-color: #0070c0;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span style="font-weight: bold"
              >{{speCheckParam.association}}</span
              >
            </i-col>
            <i-col
              span="12"
              v-if="speCheckParam.criticality !== ''"
            >
                                <span
                                  class="low_title"
                                  style="text-align: right"
                                >预警程度</span
                                >
              <span
                v-if="speCheckParam.criticality === '险兆'"
                style="
                                        background-color: #c00000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        padding: 5px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.criticality === '征兆'"
                style="
                                        background-color: #ff0000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        padding: 5px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.criticality === '萌芽'"
                style="
                                        background-color: #ffc000;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        padding: 5px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.criticality === '无预警'"
                style="
                                        background-color: #0070c0;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span
                v-if="speCheckParam.criticality === '无'"
                style="
                                        background-color: #0070c0;
                                        display: inline-block;
                                        width: 30px;
                                        height: 30px;
                                        border: 1px solid;
                                    "
              ></span>
              <span style="font-weight: bold"
              >{{speCheckParam.criticality}}</span
              >
            </i-col>
          </Row>
          <div
            class="check_card"
            v-if="Object.keys(speCheckParam.checkSuggestion).length > 0"
          >
            <t class="low_title">建议措施</t>
            <p v-if="speCheckParam.checkSuggestion.length === 0">
              暂无
            </p>
            <div
              v-else
              v-for="(op_class, op_idx) in Object.keys(speCheckParam.checkSuggestion)"
              :key="op_idx"
            >
              <p style="font-weight: bold">{{op_class}}：</p>
              <p
                style="margin-left: 2em"
                v-for="(op, idx) in speCheckParam.checkSuggestion[op_class]"
                :key="idx"
              >
                                    <span style="color: blue"
                                    >{{idx + 1}}、</span
                                    >
                {{op}}
              </p>
            </div>
          </div>
          <div style="margin-top: 20px">
            <i-button
              v-if="speCheckParam.report_path !== ''"
              type="success"
              @click="downloadSpeCheck()"
              icon="md-download"
            >下载报告</i-button
            >
          </div>
        </i-col>
      </Row>
    </Modal>

    <!-- 事故树展示 -->
    <Modal
      v-model="accDetailParam.faultTreeModal"
      title="事故树"
      footer-hide="true"
      sticky
      fullscreen
    >
      <!-- 嵌入事故树 -->
      <div id="allSampleContent" class="p-4 w-full">
        <script src="https://riskanalyse.cn:5001/static/js/go.js"></script>
        <script src="https://riskanalyse.cn:5001/static/js/jszip.min.js"></script>
        <script src="https://unpkg.com/gojs@2.2.14/extensions/Figures.js"></script>
        <div id="sample" style="display: flex">
          <div
            id="myDiagramDiv"
            style="
                                border: 1px solid black;
                                width: 100%;
                                height: calc(100vh - 90px);
                                position: relative;
                                -webkit-tap-highlight-color: rgba(
                                    255,
                                    255,
                                    255,
                                    0
                                );
                            "
          >
            <canvas
              tabindex="0"
              width="2108"
              height="1196"
              style="
                                    position: absolute;
                                    top: 0px;
                                    left: 0px;
                                    z-index: 2;
                                    user-select: none;
                                    touch-action: none;
                                    width: 1054px;
                                    height: 598px;
                                "
            >This text is displayed if your browser does not
              support the Canvas HTML element.</canvas
            >
            <div
              style="
                                    position: absolute;
                                    overflow: auto;
                                    width: 1054px;
                                    height: 598px;
                                    z-index: 1;
                                "
            >
              <div
                style="
                                        position: absolute;
                                        width: 1px;
                                        height: 1px;
                                    "
              ></div>
            </div>
          </div>
        </div>
      </div>

    </Modal>

    <!-- 事故树图片展示 -->
    <Modal
      v-model="accDetailParam.faultTreeImgModal"
      width="930"
      title="隐患事故树图片"
      footer-hide="true"
      :styles="{top: '20px'}"
    >
      <img :src="accDetailParam.faultTreeImgSrc" width="900" />
    </Modal>
  </div>
</template>

<link rel="stylesheet" type="text/css" href="https://unpkg.com/view-design/dist/styles/iview.css" />
<script type="text/javascript" src="https://unpkg.com/vue@2.6.14/dist/vue.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/view-design/dist/iview.min.js" ></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
export default {
  name: 'Accident',
  data () {
    return {
      isLogin: false,
      collValue: '0',
      myDiagram: null,
      accDetailParam: {
        dangerIndex: -1, // 当前选中隐患位置
        item_cnt: 1,
        faultTreeModal: false,
        fault_tree: '{}',
        faultTreeImgModal: false,
        faultTreeImgSrc: ''
      },
      oriCheckParam: {
        check_list: {
          name: 'test',
          content: [
            {
              checkItem: '有什么易燃易爆固体物料？',
              options: [
                '无',
                '易燃易爆固体物料',
                '冷媒增效剂',
                'LMZ',
                '硫磺',
                '煤粉',
                '红磷',
                '硝化棉',
                '铝粉'
              ]
            }
          ]
        },
        checkListDrawer: false,
        checked_list: [
          {
            checkItem: '有什么易燃易爆固体物料？',
            checked: '无'
          }
        ],
        checkDescription: '',
        checkSuggestion: '',
        item_cnt: 1,
        modelType: '1',
        association: '',
        criticality: '',
        dangers: [],
        dangerIndex: -1 // 当前选中隐患位置
      },
      speCheckParam: {
        // check_list: 记录选项和结果
        check_list: {
          name: '预防415事故的专项隐患排查表',
          content: [
            {
              name: '冷媒增效剂管理',
              content: [
                {
                  node: 'B05',
                  checkItem:
                    '现场发现冷媒增效剂的数量',
                  options: [
                    '大量',
                    '少量',
                    '几十袋',
                    '十数袋',
                    '几袋'
                  ],
                  option: ''
                }
              ]
            }
          ]
        },
        checkListDrawer: false,
        checkSuggestion: {},
        item_cnt: 1,
        modelType: '1',
        association: '',
        criticality: '',
        report_path: ''
      },
      accidentCheck: {
        modal: false,
        list: [
          {
            name: '天和惠世“4.15”重大着火中毒事故',
            aid: '2'
          }
        ],
        type: 0
      },
      split: 0.7,
      content_data: [],
      content_recommend: [],
      hd_data: [],
      hd_recommend: [],
      url: 'https://riskanalyse.cn:5001', // https://riskanalyse.cn:5001http://riskanalyse.cn:5002
      apis: {
        search_accident: '/accident/search',
        get_detail: '/accident/get',
        get_fault_tree: '/static/faultTree',
        spe_check_list: '/fault_tree/check_list',
        ori_check_list: '/static/checkList',
        spe_check_analysis: '/fault_tree/check_list_infer'
      },
      detailDrawer: false,
      preData: {
        score: 0,
        title: '',
        date: '',
        intro: '',
        content: '',
        dangers: []
      },
      searchText: [{ text: '', weight: '1' }],
      content_view: [{ text: '', view: '', condition: false }],

      nowAcci_aid: -1, // 记住当前事故
      beforeSearchFlag: true,
      searchValue: '',
      highlightStyle: true,
      accurate: true
    }
  },
  methods: {
    //  ######## 关联事故搜索 #########
    searchAccident: async function (value) {
      this.beforeSearchFlag = false
      await this.__searchContentAcc(value)
      await this.__searchHazardAcc(value)
    },
    createNewKey: function () {
      this.searchText.push({ text: '', weight: '1' })
    },
    removeItem: function (index) {
      var newArr = []
      for (let i = 0; i < this.searchText.length; i++) {
        if (i !== index) {
          newArr.push(this.searchText[i])
        }
      }
      this.searchText = newArr
    },
    showDetail: async function (item) {
      this.detailDrawer = true
      this.preData = JSON.parse(JSON.stringify(item))
      this.nowAcci_aid = this.preData.aid
      // 转换event_code
      this.preData.dangers = this.__format_event_code(
        this.preData.dangers
      )
      // 生成建议措施
      this.preData.dangers =
        await this.__genDangersSuggestion(
          this.preData.dangers,
          this.nowAcci_aid
        )

      // 初始化弹窗参数
      this.accDetailParam = {
        dangerIndex: -1,
        item_cnt: 1,
        faultTreeModal: false,
        fault_tree: '{}',
        faultTreeImgModal: false,
        faultTreeImgSrc: ''
      }
      this.content_view = [
        { text: '', view: '', condition: false }
      ]
      if (this.preData.dangers.length > 0) {
        this.accDetailParam.item_cnt = 2
      }
      // 加载因果高亮界面
      await this.__getAccDetail(item.id)
    },
    showDangerDetail: function (idx, type = 0) {
      if (type === 0) {
        this.accDetailParam.dangerIndex = idx
        this.accDetailParam.item_cnt = 3
      } else if (type === 1) {
        this.oriCheckParam.dangerIndex = idx
        this.oriCheckParam.item_cnt = 3
      }
    },
    // 根据规则生成隐患的建议措施
    __genDangersSuggestion: function (dangers, aid) {
      return new Promise((resolve, reject) => {
        let len = dangers.length
        axios.get(this.url +
          this.apis.ori_check_list +
          '/' +
          aid +
          '/suggestionRule.json'
        )
          .then((res) => {
            function compare (arr1, arr2) {
              return arr1.filter((v) => {
                return arr2.includes(v)
              })
            }
            if (res.status === 200) {
              let suggestion_list = res.data.content
              for (let i = 0; i < len; i++) {
                let danger_suggestion = []

                for (
                  let aspect_idx = 0;
                  aspect_idx <
                  suggestion_list.length;
                  aspect_idx++
                ) {
                  let suggestionRules =
                    suggestion_list[aspect_idx]
                      .suggestionRules
                  let aspects = {
                    aspectName:
                    suggestion_list[
                      aspect_idx
                      ].aspectName,
                    suggestion: []
                  }

                  for (
                    let rule_idx = 0;
                    rule_idx <
                    suggestionRules.length;
                    rule_idx++
                  ) {
                    if (
                      compare(
                        dangers[i]
                          .event_code,
                        suggestionRules[
                          rule_idx
                          ].node
                      ).length > 0
                    ) {
                      aspects.suggestion.push(
                        suggestionRules[
                          rule_idx
                          ].suggestion
                      )
                    }
                  }
                  if (
                    aspects.suggestion.length >
                    0
                  ) {
                    danger_suggestion.push(
                      aspects
                    )
                  }
                }
                dangers[i].suggestion =
                  danger_suggestion
              }
              return resolve(dangers)
            } else {
              for (let i = 0; i < len; i++) {
                dangers[i].suggestion = []
              }
              return resolve(dangers)
            }
          })
          .catch((e) => {
            for (let i = 0; i < len; i++) {
              dangers[i].suggestion = []
            }
            return resolve(dangers)
          })
      })
    },

    // ########## 事件树展示 #############
    showFaultTreeImg: function (accident_id, dangers_id) {
      let faultTreeImgSrc =
        this.url +
        this.apis.get_fault_tree +
        '/' +
        accident_id +
        '/HZDID' +
        (dangers_id - 13)
      axios
        .get(faultTreeImgSrc + '.jpg')
        .then((res) => {
          if (res.status === 200) {
            this.accDetailParam.faultTreeImgModal = true
            this.accDetailParam.faultTreeImgSrc =
              faultTreeImgSrc + '.jpg'
          } else {
            this.$Notice.warning({
              title: '获取隐患事故树失败'
            })
          }
        })
        .catch((e) => {
          axios
            .get(faultTreeImgSrc + 'a.jpg')
            .then((res) => {
              if (res.status === 200) {
                this.accDetailParam.faultTreeImgModal = true
                this.accDetailParam.faultTreeImgSrc =
                  faultTreeImgSrc + 'a.jpg'
              } else {
                this.$Notice.warning({
                  title: '获取隐患事故树失败'
                })
              }
            })
            .catch((e2) => {
              this.$Notice.warning({
                title: '数据库中无该隐患事故树'
              })
            })
        })
    },
    checkIfHaveCode: function (code, tree) {
      let flag = false
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].choice === code) {
          flag = true
          break
        }
      }
      return flag
    },
    getNode: function (code, tree) {
      let node = null
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].key === code) {
          node = tree[i]
          break
        }
      }
      return node
    },
    showSubFaultTree: function (accident_id, dangers_id) {
      this.accDetailParam.fault_tree = '{}'
      axios
        .get(
          this.url +
          this.apis.get_fault_tree +
          '/' +
          accident_id +
          '/fault_tree.json'
        )
        .then((res) => {
          if (res.status === 200) {
            this.accDetailParam.faultTreeModal = true
            let sub_tree = {
              class: 'TreeModel',
              nodeDataArray: []
            }

            for (let code of this.preData.dangers[
              this.accDetailParam.dangerIndex
              ].event_code) {
              for (let node of res.data
                .nodeDataArray) {
                if (node.choice === code) {
                  if (
                    !this.checkIfHaveCode(
                      code,
                      sub_tree.nodeDataArray
                    )
                  ) {
                    sub_tree.nodeDataArray.push(
                      node
                    )
                    while (
                      node.parent !== undefined
                      ) {
                      node = this.getNode(
                        node.parent,
                        res.data
                          .nodeDataArray
                      )
                      if (
                        !this.checkIfHaveCode(
                          node.choice,
                          sub_tree.nodeDataArray
                        )
                      ) {
                        sub_tree.nodeDataArray.push(
                          node
                        )
                      }
                    }
                  }
                }
              }
            }
            // console.log(sub_tree);
            if (
              this.accDetailParam.fault_tree !=
              sub_tree
            ) {
              this.accDetailParam.fault_tree =
                sub_tree
              if (this.myDiagram === null) {
                this.faultTree_init()
              } else {
                this.faultTree_load()
              }
            }
          } else {
            this.$Notice.warning({
              title: '获取事故树失败'
            })
          }
        })
        .catch((e) => {
          // console.log(e);
          this.$Notice.warning({
            title: '数据库中暂无该事故树'
          })
        })
    },
    showFaultTree: function (accident_id) {
      this.accDetailParam.fault_tree = '{}'
      axios
        .get(
          this.url +
          this.apis.get_fault_tree +
          '/' +
          accident_id +
          '/fault_tree.json'
        )
        .then((res) => {
          if (res.status === 200) {
            // debugger
            this.accDetailParam.faultTreeModal = true
            if (
              this.accDetailParam.fault_tree !==
              JSON.stringify(res.data)
            ) {
              this.accDetailParam.fault_tree =
                JSON.stringify(res.data)
              if (this.myDiagram === null) {
                this.faultTree_init()
              } else {
                this.faultTree_load()
              }
            }
          } else {
            this.$Notice.warning({
              title: '获取事故树失败'
            })
          }
        })
        .catch((e) => {
          this.$Notice.warning({
            title: '数据库中暂无该事故树'
          })
        })
    },

    // ########## 事故定向检查 #############
    __init_oriCheckData: function () {
      this.oriCheckParam = {
        check_list: {
          name: 'test',
          content: [
            {
              checkItem: '有什么易燃易爆固体物料？',
              options: [
                '无',
                '易燃易爆固体物料',
                '冷媒增效剂',
                'LMZ',
                '硫磺',
                '煤粉',
                '红磷',
                '硝化棉',
                '铝粉'
              ]
            }
          ]
        },
        checkListDrawer: false,
        checked_list: [
          {
            checkItem: '有什么易燃易爆固体物料？',
            checked: '无'
          }
        ],
        checkDescription: '',
        checkSuggestion: '',
        item_cnt: 1,
        modelType: '1',
        association: '',
        criticality: '',
        dangers: [],
        dangerIndex: -1 // 当前选中隐患位置
      }
    },
    // 重新初始化相似隐患
    __init_checkDangers: function () {
      this.oriCheckParam.dangers = []
      this.oriCheckParam.dangerIndex = -1
      this.oriCheckParam.association = ''
      this.oriCheckParam.criticality = ''
      this.oriCheckParam.checkDescription = ''
      this.oriCheckParam.item_cnt = 1
    },
    showOriAccList: function (accident_id) {
      this.nowAcci_aid = accident_id
      this.__init_oriCheckData()
      axios
        .get(
          this.url +
          this.apis.ori_check_list +
          '/' +
          accident_id +
          '/checkJudge.json'
        )
        .then((res) => {
          if (res.status === 200) {
            let check_list = res.data.content
            let checked_list = []
            for (
              let i = 0;
              i < check_list.length;
              i++
            ) {
              let tmp_keys = Object.keys(
                check_list[i].options
              )
              checked_list.push({
                checkItem: check_list[i].checkItem,
                checked:
                  check_list[i].options[
                    tmp_keys[0]
                    ][0]
              })
            }
            this.oriCheckParam.check_list = res.data
            this.oriCheckParam.checked_list =
              checked_list
            this.oriCheckParam.checkListDrawer = true
          } else {
            this.$Notice.warning({
              title: '获取事故定向检查表失败'
            })
          }
        })
        .catch((e) => {
          this.$Notice.warning({
            title: '数据库中暂无该事故定向检查表'
          })
        })
    },
    procOriCheckList: async function (type, name) {
      // 重新初始化相似隐患
      this.__init_checkDangers()
      // 生成描述
      this.__genCheckDescription(type, name)
      // 计算关联性和预警
      let new_checked_list = []
      for (
        let i = 0;
        i < this.oriCheckParam.checked_list.length;
        i++
      ) {
        new_checked_list.push(
          this.oriCheckParam.checked_list[i].checked
        )
      }

      let new_check_list = []
      for (
        let i = 0;
        i < this.oriCheckParam.check_list.content.length;
        i++
      ) {
        new_check_list.push(
          this.oriCheckParam.check_list.content[i].options
        )
      }

      let related = this.__calcRelated(
        new_checked_list,
        new_check_list
      )

      // 生成建议措施
      this.__genCheckSuggestion(
        new_checked_list,
        new_check_list
      )
      this.oriCheckParam.association = related.association
      this.oriCheckParam.criticality = related.criticality

      // 当有预警时候搜索相似隐患
      if (this.oriCheckParam.criticality !== '无预警') {
        this.oriCheckParam.item_cnt = 2
        this.searchText = [{ text: '', weight: '1' }]
        // 找到当前事故
        // await this.__searchSimiHazard(
        //     this.oriCheckParam.checkDescription
        // );
        let p = ''
        this.oriCheckParam.checked_list.forEach(x => {
          p += x.checked
        })
        await this.__searchSimiHazard(p)
        // 转换event_code
        this.oriCheckParam.dangers =
          this.__format_event_code(
            this.oriCheckParam.dangers
          )
        // 生成建议措施
        this.oriCheckParam.dangers =
          await this.__genDangersSuggestion(
            this.oriCheckParam.dangers,
            this.nowAcci_aid
          )
      }
    },

    __genCheckDescription: function (type, name) {
      // 没有返回值，因为某些异步问题
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (type === '1') {
            // 模板1，最好接后端处理
            let ans = this.oriCheckParam.checked_list
            this.oriCheckParam.checkDescription = `<p>在原料生产分厂${ans[3].checked}区域发现${ans[1].checked}${ans[0].checked}，它们采用${ans[2].checked}方式管控；
                            同时，在${ans[0].checked}附近有${ans[5].checked}${ans[3].checked}区域${ans[4].checked}，针对目前场景${ans[6].checked}，该区域在最坏情况下有${ans[7].checked}工作。</p>`
          } else if (type === '2') {
            // 模板2
            let ans = this.oriCheckParam.checked_list
            this.oriCheckParam.checkDescription = `<p>按专项隐患排查表分析，您发现的隐患场景有以下核心内容:</p>
                            <p>1、现场有${ans[1].checked}${ans[0].checked} </p>
                            <p>2、${ans[0].checked}存放在${ans[3].checked}，${ans[0].checked}管控措施为：${ans[2].checked}，现场通风条件为：${ans[4].checked} </p>
                            <p>3、物料附近的火源情况为：${ans[5].checked}，应急处置状况为：${ans[6].checked} </p>
                            <p>4、该区域在最坏情况下会有${ans[7].checked}</p>`
          }
        }
      })
    },

    __genCheckSuggestion: function (checked_list, check_list) {
      let checked_status = this.__checkThreshold(
        checked_list,
        check_list
      )
      let suggestions = []
      // 建议生成规则：1. 高阈值物料
      if (checked_status[0] === '高阈值') {
        if (checked_status[2] !== '低阈值') {
          suggestions.push(
            '完善' + checked_list[0] + '的管理程序'
          )
          suggestions.push(
            '提高' +
            checked_list[0] +
            '管理执行能力，加强现场管理'
          )
          suggestions.push(
            '强化员工培训提高员工对' +
            checked_list[0] +
            '的认知能力'
          )
        } else if (checked_list[6] !== '低阈值') {
          suggestions.push(
            '增强对意外事件的应急处置能力'
          )
        } else if (checked_list[5] !== '低阈值') {
          suggestions.push(
            '借鉴最佳实践，完善' +
            checked_list[0] +
            '的火作业的安全管理制度'
          )
        }
      }
      if (checked_status[3] !== '低阈值') {
        suggestions.push(
          '参照事故教训及安全管理最佳实践，提高对' +
          checked_list[3] +
          '的认知能力'
        )
        suggestions.push(
          '完善在' +
          checked_list[3] +
          '内作业的安全管理程序'
        )
        suggestions.push(
          '着重关注人员在' +
          checked_list[3] +
          '内工作的安全保障制度'
        )
      }
      this.oriCheckParam.checkSuggestion = '<ol>'
      for (let i = 0; i < suggestions.length; i++) {
        this.oriCheckParam.checkSuggestion +=
          '<li>' + suggestions[i] + '</li>'
      }
      this.oriCheckParam.checkSuggestion += '</ol>'
    },
    // 计算专项检查表单填写后的关联程度和预警，此处仅为对4.15事故的判断
    __calcRelated: function (checked_list, check_list) {
      let checked_status = this.__checkThreshold(
        checked_list,
        check_list
      )

      // 计算关联程度
      let association =
        this.__calcAssociation(checked_status)

      // 计算预警
      let criticality = this.__calcCriticality(
        association,
        checked_status
      )
      return {
        association: association,
        criticality: criticality
      }
    },
    // 判断7个问题的最终取值的阈值高低
    __checkThreshold: function (checked_list, check_list) {
      let checked_status = []
      if (checked_list.length === check_list.length) {
        for (let idx = 0; idx < check_list.length; idx++) {
          let tmp_checked = checked_list[idx]
          let tmp_check = check_list[idx]
          let check_keyList = Object.keys(tmp_check)
          for (let t_key of check_keyList) {
            let t_list = tmp_check[t_key]
            if (t_list.indexOf(tmp_checked) > -1) {
              checked_status[idx] = t_key.slice(
                0,
                -2
              )
              break
            }
          }
        }
      }
      return checked_status
    },
    // 计算关联程度
    __calcAssociation: function (checked_status) {
      let associationMatric = [
        ['高阈值', '高阈值', '高阈值', '强关联'],
        ['高阈值', '高阈值', '低阈值', '强关联'],
        ['高阈值', '低阈值', '高阈值', '关联'],
        ['高阈值', '低阈值', '低阈值', '关联'],
        ['高阈值', '高阈值', '0阈值', '关联'],
        ['低阈值', '高阈值', '高阈值', '强关联'],
        ['低阈值', '高阈值', '低阈值', '关联'],
        ['低阈值', '低阈值', '高阈值', '关联'],
        ['低阈值', '低阈值', '低阈值', '弱联'],
        ['低阈值', '高阈值', '0阈值', '弱联'],
        ['0阈值', '', '', '不关联']
      ]
      let association = ''
      for (let item of associationMatric) {
        if (
          item[0] === checked_status[0] &&
          item[1] === checked_status[3] &&
          item[2] === checked_status[5]
        ) {
          association = item[3]
          break
        }
      }
      if (association === '') {
        association = '不关联'
      }
      return association
    },
    // 计算预警
    __calcCriticality: function (association, checked_status) {
      let criticality = ''
      let cnt_high = 0
      let idx_list = [1, 2, 4, 6, 7]
      for (let idx of idx_list) {
        if (checked_status[idx] === '高阈值') {
          cnt_high += 1
        }
      }

      if (association === '强关联') {
        if (cnt_high > 3) {
          criticality = '险兆'
        } else if (cnt_high === 2 || cnt_high === 3) {
          criticality = '征兆'
        } else {
          criticality = '萌芽'
        }
      } else if (association === '关联') {
        if (cnt_high >= 3) {
          criticality = '征兆'
        } else {
          criticality = '萌芽'
        }
      } else if (association === '弱联' && cnt_high > 3) {
        criticality = '萌芽'
      } else {
        criticality = '无预警'
      }
      return criticality
    },

    // ########### 事故专项检查 ###########
    showSpeAccList: function (accident_id) {
      this.nowAcci_aid = accident_id
      this.__init_speCheckData()
      axios
        .get(
          this.url +
          this.apis.spe_check_list +
          '?accident_id=' +
          accident_id
        )
        .then((res) => {
          if (res.status === 200) {
            let data = res.data
            if (data.status === 'success') {
              // 选项赋值
              this.speCheckParam.check_list =
                data.check_list
              let length =
                data.check_list.content.length
              for (let i = 0; i < length; i++) {
                let len_class =
                  this.speCheckParam.check_list
                    .content[i].content.length
                for (
                  let j = 0;
                  j < len_class;
                  j++
                ) {
                  let checkItem =
                    this.speCheckParam
                      .check_list.content[i]
                      .content[j]
                  this.speCheckParam.check_list.content[
                    i
                    ].content[j]['option'] =
                    checkItem['options'][0]
                }
              }
              this.speCheckParam.checkListDrawer = true
            } else if (data.status === 'fail') {
              this.$Notice.warning({
                title: '获取事故专项检查表失败',
                desc: data.msg
              })
            }
          } else {
            this.$Notice.warning({
              title: '获取事故专项检查表失败'
            })
          }
        })
        .catch((e) => {
          this.$Notice.error({
            title: '获取专项检查表失败',
            desc: e
          })
        })
    },
    procSpeCheckList: async function () {
      let options = this.__gen_SpeOption(
        this.speCheckParam.check_list
      )
      await this.__getSpeCheckAnalysis(
        this.nowAcci_aid,
        options
      )
    },
    downloadSpeCheck: async function () {
      window.location.href =
        this.url + '/' + this.speCheckParam.report_path
    },
    __gen_SpeOption: function (checkList) {
      let options = []
      let length = checkList.content.length
      for (let i = 0; i < length; i++) {
        let len_class = checkList.content[i].content.length
        for (let j = 0; j < len_class; j++) {
          let checkItem = checkList.content[i].content[j]
          options.push({
            node: checkItem.node,
            option: checkItem.option
          })
        }
      }
      return options
    },
    __init_speCheckData: function () {
      this.speCheckParam = {
        check_list: {
          name: '预防415事故的专项隐患排查表',
          content: [
            {
              name: '冷媒增效剂管理',
              content: [
                {
                  node: 'B05',
                  checkItem:
                    '现场发现冷媒增效剂的数量',
                  options: [
                    '大量',
                    '少量',
                    '几十袋',
                    '十数袋',
                    '几袋'
                  ],
                  option: ''
                }
              ]
            }
          ]
        },
        checkListDrawer: false,
        checkSuggestion: {},
        item_cnt: 1,
        modelType: '1',
        association: '',
        criticality: '',
        report_path: ''
      }
    },
    __getSpeCheckAnalysis: function (accident_id, options) {
      return new Promise((resolve, reject) => {
        let data = new FormData()
        data.append('accident_id', accident_id)
        data.append('check_list', JSON.stringify(options))
        axios
          .post(
            this.url + this.apis.spe_check_analysis,
            data
          )
          .then((res) => {
            if (res.status === 200) {
              let data = res.data
              if (data.status === 'success') {
                this.speCheckParam.association =
                  data.relation_level
                this.speCheckParam.criticality =
                  data.warning_level
                this.speCheckParam.checkSuggestion =
                  data.suggestion_dic
                this.speCheckParam.report_path =
                  data.report_path
              } else if (data.status === 'fail') {
                this.$Notice.warning({
                  title: '隐患分析失败',
                  desc: data.msg
                })
              }
            } else {
              this.$Notice.error({
                title: '分析请求失败'
              })
            }
          })
          .catch((e) => {
            this.$Notice.error({
              title: '分析请求失败',
              desc: e
            })
          })
      })
    },

    // ########## 关联事故搜索：private ###########
    __genSearchData: function (
      value,
      type = 'content',
      accurate = true,
      highlight = true,
      size = 50
    ) {
      let data = new FormData()
      data.append('text', value)
      data.append('type', type)
      data.append('highlight', highlight)
      data.append('accurate', accurate)
      data.append('size', size)
      // searchText filter
      let searchData = []
      for (let i = 0; i < this.searchText.length; i++) {
        if (this.searchText[i].text !== '') {
          searchData.push(this.searchText[i])
        }
      }
      data.append('keywords', JSON.stringify(searchData))
      return data
    },
    __searchContentAcc: function (value) {
      return new Promise((resolve, reject) => {
        let data = this.__genSearchData(
          value,
          (type = 'content'),
          (accurate = this.accurate)
        )
        axios.post(
            this.url + this.apis.search_accident,
            data
          )
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === 'success'
            ) {
              this.content_data = res.data.data
              this.content_recommend = res.data.recommend
              return resolve('success')
            } else {
              return reject('fail')
            }
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    __searchHazardAcc: function (value) {
      return new Promise((resolve, reject) => {
        let data = this.__genSearchData(
          value,
          (type = 'hd'),
          (accurate = this.accurate),
          (highlight = true)
        )
        axios
          .post(
            this.url + this.apis.search_accident,
            data
          )
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === 'success'
            ) {
              this.hd_recommend = res.data.recommend
              this.hd_data = res.data.data
            } else {
              return reject('fail')
            }
          })
          .catch((err) => {
            return reject('fail')
          })
      })
    },
    __searchSimiHazard: function (value) {
      return new Promise((resolve, reject) => {
        let data = this.__genSearchData(
          value,
          (type = 'hd'),
          (accurate = false),
          (highlight = false)
        )
        axios
          .post(
            this.url + this.apis.search_accident,
            data
          )
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === 'success'
            ) {
              // 专项检查表，查找事故关联隐患列表
              let accList = res.data.data
              accList.concat(res.data.recommend)
              for (let item of accList) {
                if (
                  item.aid ===
                  this.nowAcci_aid
                ) {
                  this.oriCheckParam.dangers = item.dangers
                }
              }
              return resolve('fail')
            } else {
              return reject('fail')
            }
          })
          .catch((err) => {
            return reject('fail')
          })
      })
    },
    // 加载事故详细信息
    __getAccDetail: function (accident_id) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            this.url +
            this.apis.get_detail +
            '?id=' +
            accident_id
          )
          .then((res) => {
            if (
              res.status === 200 &&
              res.data.status === 'success'
            ) {
              this.content_view = res.data.data.view
              return resolve('success')
            } else {
              return reject('fail')
            }
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },

    // ########## 事故树展示：private ###########
    faultTree_init: function () {
      // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
      // For details, see https://gojs.net/latest/intro/buildingObjects.html
      const $ = go.GraphObject.make // for conciseness in defining templates
      this.myDiagram = $(go.Diagram, 'myDiagramDiv', {
        allowCopy: false,
        allowDelete: false,
        'draggingTool.dragsTree': true,
        layout: $(go.TreeLayout, {
          angle: 90,
          layerSpacing: 30
        }),
        'undoManager.isEnabled': true
      })

      // when the document is modified, add a "*" to the title and enable the "Save" button
      this.myDiagram.addDiagramListener('Modified', (e) => {
        var button = document.getElementById('SaveButton')
        if (button) { button.disabled = !this.myDiagram.isModified }
        var idx = document.title.indexOf('*')
        if (this.myDiagram.isModified) {
          if (idx < 0) document.title += '*'
        } else {
          if (idx >= 0) {
            document.title = document.title.slice(
              0,
              idx
            )
          }
        }
      })

      function nodeFillConverter (figure) {
        switch (figure) {
          case 'AndGate':
            // right to left so when it's rotated, it goes from top to bottom
            return $(go.Brush, 'Linear', {
              0: '#EA8100',
              1: '#C66D00',
              start: go.Spot.Right,
              end: go.Spot.Left
            })
          case 'OrGate':
            return $(go.Brush, 'Linear', {
              0: '#0058D3',
              1: '#004FB7',
              start: go.Spot.Right,
              end: go.Spot.Left
            })
          case 'Circle':
            return $(go.Brush, 'Linear', {
              0: '#009620',
              1: '#007717'
            })
          case 'Triangle':
            return $(go.Brush, 'Linear', {
              0: '#7A0099',
              1: '#63007F'
            })
          default:
            return 'whitesmoke'
        }
      }

      this.myDiagram.nodeTemplate = // the default node template
        $(
          go.Node,
          'Spot',
          {
            selectionObjectName: 'BODY',
            locationSpot: go.Spot.Center,
            locationObjectName: 'BODY'
          },
          // the main "BODY" consists of a Rectangle surrounding some text
          $(
            go.Panel,
            'Auto',
            { name: 'BODY', portId: '' },
            $(go.Shape, {
              fill: $(go.Brush, 'Linear', {
                0: '#770000',
                1: '#600000'
              }),
              stroke: null
            }),
            $(
              go.TextBlock,
              {
                margin: new go.Margin(2, 10, 1, 10),
                maxSize: new go.Size(100, NaN),
                stroke: 'whitesmoke',
                font: '10pt Segoe UI, sans-serif'
              },
              new go.Binding('text')
            )
          ), // end "BODY", an Auto Panel
          $('TreeExpanderButton', {
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Left,
            'ButtonBorder.figure': 'Rectangle'
          }),
          $(
            go.Shape,
            'LineV',
            new go.Binding(
              'visible',
              'figure',
              (f) => f !== 'None'
            ),
            {
              strokeWidth: 1.5,
              height: 20,
              alignment: new go.Spot(0.5, 1, 0, -1),
              alignmentFocus: go.Spot.Top
            }
          ),
          $(
            go.Shape,
            new go.Binding(
              'visible',
              'figure',
              (f) => f !== 'None'
            ),
            {
              alignment: new go.Spot(0.5, 1, 0, 5),
              alignmentFocus: go.Spot.Top,
              width: 30,
              height: 30,
              stroke: null
            },
            new go.Binding('figure'),
            new go.Binding(
              'fill',
              'figure',
              nodeFillConverter
            ),
            new go.Binding('angle', 'figure', (f) =>
              f === 'OrGate' || f === 'AndGate'
                ? -90
                : 0
            )
          ), // ORs and ANDs should point upwards
          $(
            go.TextBlock,
            new go.Binding(
              'visible',
              'figure',
              (f) => f !== 'None'
            ), // if we don't have a figure, don't display any choice text
            {
              alignment: new go.Spot(0.5, 1, 20, 20),
              alignmentFocus: go.Spot.Left,
              stroke: 'black',
              font: '10pt Segoe UI, sans-serif'
            },
            new go.Binding('text', 'choice')
          )
        )

      this.myDiagram.linkTemplate = $(
        go.Link,
        go.Link.Orthogonal,
        {
          layerName: 'Background',
          curviness: 20,
          corner: 5
        },
        $(go.Shape, { strokeWidth: 1.5 })
      )

      this.faultTree_load()
    },
    faultTree_load: function () {
      this.myDiagram.model = go.Model.fromJson(
        this.accDetailParam.fault_tree
      )
    },

    // ######### 定向 / 专项检查入口 ############
    searchAccidentName: function (value) {
      // search accident
      this.accidentCheck.list = [
        {
          name: '天和惠世“4.15”重大着火中毒事故',
          aid: '2'
        }
      ]
    },
    specialCheckEntrance: function (type = 0) {
      // get accident list
      this.accidentCheck.list = [
        {
          name: '肥城阿斯德“3.22”煤气柜闪爆事故',
          aid: 1
        },
        {
          name: '天和惠世“4.15”重大着火中毒事故',
          aid: 2
        },
        {
          name: '东3营市山东滨源化学有限公司“8•1”重大爆炸事故',
          aid: 3
        },
        {
          name: '万华化学集团股份公司烟台工业园“9.20”较大爆炸事故',
          aid: 4
        },
        {
          name: '日照市山东石大科技石化有限公司 “7•16”较大着火爆炸事故',
          aid: 5
        },
        {
          name: '山东润兴化工科技有限公司“8·22”一般爆燃事故',
          aid: 6
        },
        {
          name: '平邑县丰源有限责任公司“6·28”一般爆炸事故',
          aid: 7
        },
        {
          name: '山东阳煤恒通化工股份有限公司“4•11”一般爆炸事故',
          aid: 8
        },
        {
          name: '东营农业高新技术产业示范区“9.18”爆燃事故',
          aid: 9
        },
        {
          name: '德州佳兴化工有限公司“9•13”爆燃事故',
          aid: 10
        },
        {
          name: '济南圣泉集团股份有限公司“8·4”火灾事故',
          aid: 11
        },
        {
          name: '莒南华盛化工有限公司“4•16”一般燃爆事故',
          aid: 12
        },
        {
          name: '联化科技（德州）有限公司“4·3”一般爆炸事故',
          aid: 13
        },
        {
          name: '淄博高新区山东一诺威聚氨酯股份有限公司“12.20”窒息事故',
          aid: 14
        }
      ]
      // show modal
      this.accidentCheck.modal = true
      this.accidentCheck.type = type
    },
    showSpecialCheckDetail: function (idx) {
      if (this.accidentCheck.type === 0) {
        this.showOriAccList(
          this.accidentCheck.list[idx].aid
        )
      } else if (this.accidentCheck.type === 1) {
        this.showSpeAccList(
          this.accidentCheck.list[idx].aid
        )
      }
    },
    // 将event_code从字符串转为数组
    __format_event_code: function (dangers) {
      for (let i = 0; i < dangers.length; i++) {
        if (dangers[i].event_code) {
          dangers[i].event_code = dangers[i].event_code
            .replace(/，|, /g, ',')
            .split(',')
        } else {
          dangers[i].event_code = []
        }
      }
      return dangers
    }
  }
}
</script>

<style>
.center-title {
  margin: 10% auto 20px auto;
  width: 500px;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
}
.my_btn {
  appearance: none;
  background-color: #fafbfc;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
  rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292e;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI",
  Helvetica, Arial, sans-serif, "Apple Color Emoji",
  "Segoe UI Emoji";
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s
  cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
}

.my_btn:hover {
  background-color: #f3f4f6;
  text-decoration: none;
  transition-duration: 0.1s;
}

.my_btn:disabled {
  background-color: #fafbfc;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959da5;
  cursor: default;
}

.my_btn:active {
  background-color: #edeff2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

.my_btn:focus {
  outline: 1px transparent;
}

.my_btn:before {
  display: none;
}

.my_btn::-webkit-details-marker {
  display: none;
}
</style>
