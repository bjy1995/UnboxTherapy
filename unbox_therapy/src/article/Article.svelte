<script>

</script>

<style>
	#description {
    margin-bottom: 60px;
    margin-left: auto;
    margin-right: auto;
    max-width: 78ch;
  }

  #description h2 {
    color: #444;
    font-size: 40px;
    font-weight: 450;
    margin-bottom: 12px;
    margin-top: 60px;
  }

  #description h4 {
    font-style: italic;
    color: steelblue;
    font-size: 20px;
    font-weight: 450;
    margin-bottom: 8px;
    margin-top: 44px;
  }

  #description h3 {
    font-style: italic;
    color: steelblue;
    font-size: 24px;
    font-weight: 450;
    margin-bottom: 8px;
    margin-top: 44px;
  }

  #description p {
    margin: 16px 0;
  }

  #description p img {
    vertical-align: middle;
  }

  #description .figure-caption {
    font-size: 13px;
    margin-top: 5px;
  }

  #description ol {
    margin-left: 40px;
  }

  #description p, 
  #description div,
  #description li {
    color: #555;
    font-size: 17px;
    line-height: 1.6;
  }

  #description small {
    font-size: 12px;
  }

  #description ol li img {
    vertical-align: middle;
  }

</style>


<body>
  <div id="description">
    <div id="One"><h2><strong>Section: 卷积神经网络</strong></h2></div>
    <p>
        <strong>
            几天之后一个周末，你的同学来你家里玩。听说你实现了一个能够自动识别鸢尾花品种的识别程序，他十分感兴趣，于是在手机中找出了一张之前在郊外拍摄到的一张鸢尾花照片，问你的软件能不能识别照片中的鸢尾花
            品种。这就让你犯了难了，之前你都是通过实地测量出鸢尾花的花瓣花萼的长宽等特征来输入网络中进行分类，而现在仅仅只有一张照片，从照片中测量得到的长宽也一定与实际相差甚远，如何通过图像来识别鸢尾花
            的品种，这又让你找到了一个新的挑战。
        </strong>
    </p>
      <p>
        <strong>
            经过网络上的一番资料查阅，你发现当今的人工智能技术已经能够识别图像中物体的种类，而这些人工智能使用的技术是一个叫做卷积神经网络的网络结构。于是你决定尝试一下使用卷积神经网络来对图片中的鸢尾花进行分类。
        </strong>
    </p>
    <h3>什么是卷积神经网络？</h3>
    <p>
		在机器学习中，往往都是从输入的特征中找到不同类别之间的区别从而进行分类。而与之前用测量的鸢尾花数据作为输入不同，这次我们的输入是一张图片。这时候，使用一个 <em>卷积神经网络</em>，或简称为CNN，是一种非常适合解决这种问题类型的分类器！
	 </p>
  	<p>
  		与之前的神经网络相似，CNN也是从输入中找到具有代表性的特征，从而能够区分不同的图片类型，只不过它的网络会更加复杂一些，也多了一些特殊的层，总的来说它有以下几种关键构造：
  	</p>
  	<ol>
  		<li><strong>输入：</strong> 之前网络的输入往往是一组代表不同特征的数字，而在计算机中我们往往使用一个m×n的矩阵来代表一张图片，在CNN中便是已这个矩阵作为输入。</li>
  		<li><strong>神经元：</strong> 与普通的神经网络相似，每个神经元都代表了前一层的输出通过一次函数计算得到的一个新的代表隐含的特征的值。</li>
  		<li><strong>层：</strong> 每次使用相同的操作处理一组神经元，得到一组新的神经元的这个操作阶段叫做一层。</li>
  		<li><strong>内核权重和偏差：</strong>如图神经网络一样，在CNN中也是通过将输入与内核权重及偏差做函数计算来得到新的输出。</li>
  	</ol> 
 
      <h3>CNN中不同层的作用</h3>
      <h4 id='article-input'> 输入层</h4>
      <p>
      输入层（最左边的层）代表输入到CNN中的图像。因为我们使用RGB图像作为输入，所以输入层具有三个通道，分别对应于该层中显示的红色，绿色和蓝色通道。
      </p>
      <h4 id='article-convolution'> 卷积层</h4>
      <p>
      卷积层是CNN的基础，因为它们包含可学习的内核（权重），这些内核提取出可将不同图像彼此区分开的特征-这就是我们想要的分类
      </p>
      <p>
        如图1所示卷积过程是将内核中的参数与输入中对应大小的参数一一对应进行相乘再求和后得到一个对应该输入位置的结果，通过滑动改变内核相对应的位置，来得到右侧的输出。
      </p>
    <div class="figure">
      <img src="PUBLIC_URL/assets/figures/convolution.gif" alt="clicking on topmost first conv. layer activation map" />
      <div class="figure-caption">
        图1:卷积层的计算过程。一个3×3的卷积核，通过在左侧滑动位置，逐个计算出对应位置的结果，最终得到右侧的输出。
      </div>
    </div>

    <h4 id='article-pooling'>池化层</h4>
    <p>
      在不同的CNN架构中，池化层的类型很多，但是它们的目的都是要逐渐减小网络的空间范围，从而减少网络的参数和总体计算。
    </p>
    <p>
      最大池操作需要在体系结构设计期间选择内核大小和步幅长度。选择后，该操作将以指定的步幅在输入上滑动内核，同时仅从输入中选择每个内核切片上的最大值以产生输出值。
    </p>
 
    <h4 id='article-softmax'>Softmax函数</h4>
    <p>
      softmax操作的主要作用是：确保CNN输出总和为1。因此，softmax操作可用于将模型输出缩放为概率。
    </p>

    <h4 id='try'>尝试一下</h4>
    <p>
      通过学习卷积网络的基本概念，你了解到CNN通过卷积层从图像中提取出局部特征，从而能够让网络学会“看”图。比起之前使用的网络需要提供人工选定的特征，CNN只需要输入一张图片，这无疑减少了许多的前期准备的工作量。
    </p>
    <p>
      CNN的优势及其它的独特之处使你对它的原理构造更加的感兴趣了。经过一番努力之后，你终于实现了一个简单的CNN来用于分类鸢尾花的种类。而现在有三个不同品种的鸢尾花图像测试样本，来看看CNN是如何分辨出它是哪一个品种的鸢尾花的吧！
    </p>
  </div>
</body>