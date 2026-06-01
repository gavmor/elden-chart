Theoretical Foundations of Consumer E-Commerce Decision-Making

Modern digital commerce presents consumers with an unprecedented volume of product alternatives and multi-attribute specifications.[1, 2] While this digital transformation promises transparency, it frequently induces a state of information overload, colloquially termed infobesity or infoxication.[1, 3] Information overload occurs when the volume, complexity, and contradictory nature of available data exceed an individual's cognitive processing capacity.[3, 4] The human mind operates under strict working memory constraints; when these processing thresholds are breached, decision-making quality degrades significantly.[3, 5] Consumers experience decision fatigue, psychological strain, anxiety, and consumer confusion, which ultimately culminate in purchase avoidance or decision paralysis.[1, 4, 6]

To manage this complexity, consumers rely on a diverse repertoire of decision strategies, navigating a fundamental trade-off between decision accuracy and cognitive effort.[2, 7, 8] According to Adaptive Decision-Making Theory, individuals select strategies that minimize cognitive strain while aiming for an acceptable level of accuracy given their motivation, domain expertise, and contextual constraints.[2, 7, 8] These strategies are broadly categorized into non-compensatory and compensatory models:

|Strategy Category|Key Mathematical / Logical Formulation|Cognitive Profile & Trade-offs|Behavioral Application in E-Commerce|
|---|---|---|---|
|**Non-Compensatory (e.g., Elimination-by-Aspects)**|Establish thresholds θi​ for attributes ai​. Reject alternative x if xi​<θi​.[2, 9]|Low cognitive effort; high speed; risks premature exclusion of high-value options.[2, 8, 10]|Initial funneling; setting hard limits on budget, physical size, or hardware interface type.[2, 10, 11]|
|**Compensatory (e.g., Multi-Attribute Utility Model)**|U(x)=∑i=1n​wi​ui​(xi​) where wi​ is attribute weight and ui​ is sub-utility.[8]|High cognitive effort; high accuracy; permits trade-offs across all dimensions.[7, 8]|Final choice selection; weighing incremental performance gains against cost differentials.[7, 12]|

The interaction between these strategies dictates the architecture of effective computer-based decision aids.[1, 2] Empirical research indicates that individual cognitive traits, such as Need for Cognition (NFC)—which characterizes an individual's intrinsic tendency to engage in and enjoy effortful cognitive activities—strongly moderate how decision aids are utilized.[1] In a simulated online scenario (N=206), promotional nudges encouraging the use of decision aids significantly improved decision quality.[1] Crucially, these benefits were primarily concentrated among consumers with low NFC.[1] This suggests that interactive decision tools serve as essential cognitive prostheses for individuals who are otherwise less inclined toward systematic, resource-intensive information processing, bridging the gap between average cognitive effort and objective choice optimization.[1]

Interactive Spatial Representation versus Tabular Lists

The standard e-commerce interface presents product comparisons using tabular matrices or vertical, ranked textual lists.[7, 10] While tables are highly effective at answering precise, lookup-based questions (e.g., "What is the exact price of product X?"), they are fundamentally poorly suited for synthesizing relationships across many entities.[13] To identify trends or detect outliers in a table, a consumer must perform sequential text-processing operations, reading through lines of alphanumeric data, storing them in working memory, and mentally executing calculations.[10, 13, 14] This sequential processing imposes a heavy extraneous cognitive load.[15] Under conditions of cognitive load, such as distracted shopping environments, a consumer’s ability to perform these deliberative, synthesis-level operations is severely suppressed, leading to degraded choice accuracy.[14]

In contrast, interactive XY scatter plots map multi-attribute products as distinct coordinates in a two-dimensional spatial layout.[10, 16] This representation offloads cognitive processing to the human visual system, converting effortful symbolic calculations into rapid, pre-attentive perceptual operations.[10, 14] Scatter plots are uniquely optimized to answer relational questions (e.g., "Where do these metrics relate, and which specific products stand out?").[13]

By plotting products as distinct points, the visual system identifies patterns, clusters, and anomalies without requiring conscious calculation.[13, 17, 18] This spatial grouping leverages Gestalt principles of visual hierarchy, proximity, and common region to organize the decision space automatically, allowing the user to ignore the "fog" of irrelevant options and focus on high-performing candidates.[13, 15, 19]

Furthermore, experimental research under cognitive load demonstrates a stark divergence in task performance based on visualization type.[14] While simple identification tasks (such as locating a point) remain relatively unharmed under load, complex behavioral optimizations are heavily compromised.[14] When consumers are presented with spatial scatter plots, they can continue to make highly accurate behavioral choices even when their working memory is partially occupied.[14]

However, scatter plots can become visually congested when the dataset is extremely large, a phenomenon known as overplotting.[18] In overloaded visual environments, empirical studies show that adjusting the visual properties of the markers, such as increasing dot size, has a highly positive effect on the user’s ability to correctly recognize the underlying regressions and trends.[18] This visual optimization remains effective even when individual data points overlap completely, allowing the pre-attentive sensory systems to derive the overall trend line of the dataset.[18]

The Neuro-Cognitive Mechanics of Scatter Plot Interpretation

The cognitive efficiency of interactive XY plots is supported by underlying neurobiological mechanisms.[20] Electroencephalogram (EEG) and Event-Related Potential (ERP) studies have mapped human brain activity during decision-making tasks informed by scatter plots.[20] To evaluate how users interpret these visualizations, researchers employ Graph-theoretic Scatterplot Diagnostics (Scagnostics).[20] Scagnostics automatically categorize scatter plots into distinct geometric and statistical profiles, including Clumpy, Monotonic, Striated, and Stringy distributions.[20]

```
                    
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │          Occipital Lobe Activation        │
                  │   (Primary Visual Sensory Cortices)       │
                  └───────────────────────────────────────────┘
                                        │
                    Is the visual task simple or complex?
                    /                                       \
                           
                 │                                            │
                 ▼                                            ▼
┌───────────────────────────────────┐       ┌───────────────────────────────────┐
│     Occipital Lobe Dominance      │       │     Cerebral Recruitment Shift    │
│  - Low cognitive demand           │       │  - Temporal & Parietal lobes      │
│  - Pre-attentive pattern matching │       │  - Executive coordination         │
└───────────────────────────────────┘       │  - Effortful visual search        │
                                            └───────────────────────────────────┘
```

The neural processing pathways adapt dynamically to the visual complexity of the data [20]:

- **Occipital Lobe Dominance:** During simple visual discrimination tasks—where the relationship between variables is highly pronounced and easily discernible—neural activity is localized primarily within the visual sensory cortices of the occipital lobe.[20] This indicates that the brain is utilizing highly efficient, low-energy perceptual processes to identify relationships, requiring virtually no executive cognitive resources.[20]
- **Cerebral Recruitment Shift:** As the visual task becomes more complex (e.g., separating clumpy distributions from stringy ones), brain activation shifts, recruiting broader temporal and parietal regions to coordinate effortful visual search and spatial integration.[20]

These neural pathways are highly relevant to the design of e-commerce similarity algorithms.[21] Platforms such as ProductChart.com utilize specification-based distance metrics to compute the spatial proximity of products.[21] By representing product specifications as vectors, the system calculates the pairwise similarity between a target product x and alternative products y using weighted Euclidean distance in an n-dimensional spec-space:

d(x,y)=i=1∑n​wi​(xi​−yi​)2![](data:image/svg+xml;utf8,<svg%20xmlns="http://www.w3.org/2000/svg"%20width="400em"%20height="3.1968em"%20viewBox="0%200%20400000%203196"%20preserveAspectRatio="xMinYMin%20slice"><path%20d="M702%2080H40000040H742v3062l-4%204-4%204c-.667.7%20-2%201.5-4%202.5s-4.167%201.833-6.5%202.5-5.5%201-9.5%201h-12l-28-84c-16.667-52-96.667%20-294.333-240-727l-212%20-643%20-85%20170c-4-3.333-8.333-7.667-13%20-13l-13-13l77-155%2077-156c66%20199.333%20139%20419.667219%20661%20l218%20661zM702%2080H400000v40H742z"></path></svg>)​

This mathematical distance is then translated directly into visual distance on the scatter plot.[21] By mapping multidimensional spec-similarity to two-dimensional spatial proximity, the interface allows the consumer’s primary visual cortex to execute advanced similarity clustering.[20, 21] The user can immediately identify similar products by looking at those grouped nearby in the coordinate space, replacing complex mathematical calculations with immediate visual processing.[20, 21]

System Architecture and Parameter Customization on ProductChart.com

ProductChart.com, engineered by Marek Gibney, represents a functional application of these visual cognitive theories to e-commerce decision-making.[22] Originally developed as a static chart mapping 200 popular flash drives, the platform evolved into a comprehensive suite of interactive spatial product finders.[22] To maintain the high operational speed required for real-time visual rendering, the platform is built on a highly optimized, lightweight single-page application framework (e.g., Mithril JS) with no compilation step, preventing the "stack rot" that frequently compromises complex web applications over time.[23]

Crucially, rather than relying on automated web scraping APIs—which often inject corrupted or unformatted specifications into comparison engines—ProductChart.com utilizes a strictly manual data verification and proofreading process for over 45,000 products to ensure absolute data integrity.[24, 25]

The interface of the flash drive comparison application (`productchart.com/flashdrives/`) illustrates the density of information made accessible to the user.[11] The platform maps a highly fragmented market of consumer storage devices into a clean, searchable, and interactive spatial matrix.[11]

|Product Model Name|Storage Capacity (GB)|Interface Connection Type|Read Performance (MB/s)|Retail Price (USD)|Specification Metrics [11, 26]|
|---|---|---|---|---|---|
|**SanDisk Crayola**|128|USB-C|300|$34.99|Highly specialized, USB-C-only performance flash drive. [26]|
|**SanDisk Ultra SDDDC2**|128|USB-A + USB-C|150|$29.99|Dual connector versatility at the expense of read speeds. [26]|
|**Samsung BAR Plus**|256|USB-A|400|$68.38|High-speed, durable metal casing design. [11]|
|**Samsung BAR Plus**|512|USB-A|400|$145.99|High-capacity model illustrating non-linear price scaling. [11]|
|**SanDisk Ultra Flair**|128|USB-A|150|$25.99|Entry-level value option; widely distributed. [11]|
|**Transcend ESD310**|256|USB-A + USB-C|1050|$65.38|Ultra-performance SSD-grade flash drive. [11]|
|**Apricorn Aegis 3NX**|8|USB-A|77|$118.95|High-cost, hardware-encrypted security drive. [11]|

This raw data, when presented in a traditional tabular format, requires significant cognitive effort to analyze.[10, 15] ProductChart.com projects these data points onto a customizable XY scatter plot, establishing Price as the default vertical Y-axis and permitting the user to dynamically map the horizontal X-axis to attributes such as Storage, Read Speed, or Gigabytes per Dollar.[10, 11]

The critical utility of this dynamic mapping is demonstrated when examining products with highly subjective, demographic-specific constraints.[27] For example, in the laptop market, developers and text-focused professionals strongly prefer matte screens due to reduced eye strain and high readability in varying light conditions.[27] Conversely, designers and gamers prefer glossy, high-contrast screens that make colors look more vivid.[27]

On ProductChart.com, a user can instantly apply a "matte screen" filter, and the XY plot will dynamically prune all glossy options.[27] This allows the user to immediately evaluate the price-to-weight or price-to-performance ratio of the remaining matte models without being distracted by glossy options that do not fit their profile.[27]

```
                
                               │
            Is the user a developer or a designer?
            /                                     \
            
           │                                       │
           ▼                                       ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│  Apply "Matte Screen" Filter │       │ Apply "Glossy Screen" Filter │
└──────────────────────────────┘       └──────────────────────────────┘
           │                                       │
           ├───────────────────────────────────────┘
           ▼

  - Eliminates incompatible products
  - Re-scales axes to show remaining product distribution
  - Renders optimal price-performance trade-offs visually
```

This interaction demonstrates the superiority of visual filtering over traditional search engines.[7, 10] Traditional text searches often result in a binary match or mismatch, forcing the user to reformulate queries repeatedly.[7] By contrast, the live-updating visual matrix preserves the global context of the market, showing the user exactly where the remaining options lie relative to the broader price-performance landscape.[7, 10]

Strategy Integration and the Visual Mapping of the Pareto Frontier

The exceptional utility of interactive scatter plots in decision-making lies in their unique ability to integrate both non-compensatory and compensatory decision strategies into a single, seamless interaction.[2, 7] In standard e-commerce, these stages are isolated: a user must first use hard filter checkboxes to narrow down a search, and then open dozens of tabs to manually compare the remaining items.[7, 10]

On ProductChart.com, this process is unified.[10, 22] As the user adjusts specification sliders in the sidebar, they are executing an Elimination-by-Aspects strategy.[2, 10] The scatter plot updates in real time, instantly removing excluded products and visually shrinking the data cloud.[10]

Once the consideration set is narrowed, the consumer shifts to a compensatory strategy to evaluate the remaining trade-offs.[7, 10] This evaluation is optimized through the visual identification of the Pareto Frontier—the boundary containing all non-dominated options where no single attribute can be improved without degrading another.[12, 28, 29]

When Price is mapped to the vertical Y-axis (where lower is better) and Read Speed is mapped to the horizontal X-axis (where higher is better), the Pareto Frontier forms the lower-right boundary of the scatter plot.[10, 12, 13] Any product positioned above and to the left of this frontier is strictly dominated.[12, 13] A consumer can visually eliminate these dominated models instantly, focusing their cognitive resources exclusively on the options that rest directly on the frontier.[12, 13]

This mathematical optimization is highly relevant when analyzing complex, high-stakes trade-offs, such as enterprise data storage planning.[30] For instance, when evaluating a backup strategy, an organization must compare the cost of High-Density Hard Disk Drives (HDDs) against LTO-9 Tape Backup Systems.[30] While LTO-9 tapes are highly economical per gigabyte, they require a substantial upfront investment in a tape drive, creating a step-function cost progression.[30] This optimization can be modeled using the following cost functions:

Let D be the total storage demand in Terabytes (TB).

HDD System Cost: CHDD​(D)=(28D​)×480

LTO-9 Tape System Cost: CTape​(D)=6499+(45D​)×90

At low storage capacities, the hard drive option is significantly more economical.[30] However, as the storage volume increases, the low variable cost of tape media ($90 per 45 TB tape) begins to offset the high fixed cost of the tape drive ($6,499).[30] The exact mathematical crossover point where tape storage becomes more economical than HDD systems occurs at 448 Terabytes:

CHDD​(448)=16×480=$7,680

CTape​(448)=6499+10×90=$7,399

This complex, step-wise cost progression is precisely what an interactive scatter plot visualizes so effortlessly.[13, 30] Rather than forcing a buyer to build spreadsheet models, the XY plot maps this crossover point visually, allowing the corporate decision-maker to instantly locate the inflection point on the Pareto Frontier and make an optimal procurement decision.[12, 13, 30]

Synthesized Conclusions and Actionable System Design Principles

The empirical analysis of interactive XY plots, such as those implemented on ProductChart.com, reveals their immense value in optimizing consumer choice.[10, 22] By converting complex, multi-attribute alphanumeric data into a single, intuitive spatial visualization, these systems offload visual search and mathematical trade-offs to pre-attentive sensory processing pathways, protecting the consumer's limited working memory.[14, 15, 20]

To enhance decision quality, reduce choice paralysis, and optimize the overall user experience, designers of digital commerce and decision-support systems should adhere to the following principles:

- **Dynamic Coordinate Mapping:** Provide users with full control to customize both the X and Y axes, allowing them to map their primary attributes of interest (e.g., Price, Speed, or Capacity) and instantly visualize custom value relationships.[10, 11]
- **Real-Time Visual Pruning:** Link all specification sliders directly to the spatial plot, ensuring that as users execute non-compensatory filtering (Elimination-by-Aspects), the visual data cloud shrinks dynamically without requiring a page refresh.[7, 10]
- **Highlighting the Pareto Frontier:** Visually emphasize the optimal boundary (the lower-right or upper-left frontier depending on the axes) using subtle highlighting or shading to draw the user’s eye to the non-dominated alternatives, instantly eliminating inefficient options.[12, 13]
- **Marker Design Optimization:** When displaying dense datasets, avoid visual congestion by implementing adjustable marker sizes or automatic zoom levels, ensuring the visual cortex can easily recognize regressions and trends even under high data density.[18, 31]
- **Data Curation Integrity:** Prioritize manual verification or highly refined semantic parsing of product data over unvetted scrapers to prevent erroneous or duplicate data points from corrupting the spatial mapping and eroding user trust.[24, 32]

--------------------------------------------------------------------------------

1. Enhancing decision quality through computer-based decision aids: how promotional interventions and Need for Cognition shape effectiveness in online consumer choices - Frontiers, [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1576319/full](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.frontiersin.org%2Fjournals%2Fpsychology%2Farticles%2F10.3389%2Ffpsyg.2025.1576319%2Ffull)
2. Do online shops support customersâ€™ decision strategies by ..., [http://relaunch.rene-riedl.at/wp-content/uploads/2018/02/5BGroissberger-Riedl-2017b5D.pdf](https://www.google.com/url?sa=E&q=http%3A%2F%2Frelaunch.rene-riedl.at%2Fwp-content%2Fuploads%2F2018%2F02%2F5BGroissberger-Riedl-2017b5D.pdf)
3. Information overload - Wikipedia, [https://en.wikipedia.org/wiki/Information_overload](https://www.google.com/url?sa=E&q=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FInformation_overload)
4. When More Is Less: Information Overload and the Psychology of Decision-Making in Cryptocurrency Investment - MDPI, [https://www.mdpi.com/2813-9844/8/1/17](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.mdpi.com%2F2813-9844%2F8%2F1%2F17)
5. The Role of Cognitive Load and Individual Differences When Interpreting Human-Resource Data Visualizations - PDXScholar, [https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?article=2290&context=honorstheses](https://www.google.com/url?sa=E&q=https%3A%2F%2Fpdxscholar.library.pdx.edu%2Fcgi%2Fviewcontent.cgi%3Farticle%3D2290%26context%3Dhonorstheses)
6. The impact of social media influencer information overload on purchase avoidance: the role of customer confusion and prior product knowledge | Journal of Research in Interactive Marketing | Emerald Publishing, [https://www.emerald.com/jrim/article/19/6/897/1256020/The-impact-of-social-media-influencer-information](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.emerald.com%2Fjrim%2Farticle%2F19%2F6%2F897%2F1256020%2FThe-impact-of-social-media-influencer-information)
7. Designing Tools for Supporting User Decision-Making in e-Commerce., [https://opendl.ifip-tc6.org/db/conf/interact/interact2009-2/SutcliffeA09.pdf](https://www.google.com/url?sa=E&q=https%3A%2F%2Fopendl.ifip-tc6.org%2Fdb%2Fconf%2Finteract%2Finteract2009-2%2FSutcliffeA09.pdf)
8. Maintaining Accuracy While Reducing Effort in Online Decision Making: A New Quantitative Approach for Multi-Attribute Decision Problems Based on Principal Component Analysis - MDPI, [https://www.mdpi.com/0718-1876/19/4/140](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.mdpi.com%2F0718-1876%2F19%2F4%2F140)
9. An Empirical Study of User Decision Making Behavior in E-Commerce - ResearchGate, [https://www.researchgate.net/publication/300644534_An_Empirical_Study_of_User_Decision_Making_Behavior_in_E-Commerce](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.researchgate.net%2Fpublication%2F300644534_An_Empirical_Study_of_User_Decision_Making_Behavior_in_E-Commerce)
10. Improving Usability of User Centric Decision Making of Multi ... - arXiv, [https://arxiv.org/pdf/2004.12923](https://www.google.com/url?sa=E&q=https%3A%2F%2Farxiv.org%2Fpdf%2F2004.12923)
11. Flash Drive Comparison - Product Chart, [https://www.productchart.com/flashdrives/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.productchart.com%2Fflashdrives%2F)
12. Multi-Attribute Decision Matrices, Done Right | Towards Data Science, [https://towardsdatascience.com/multi-attribute-decision-matrices-done-right/](https://www.google.com/url?sa=E&q=https%3A%2F%2Ftowardsdatascience.com%2Fmulti-attribute-decision-matrices-done-right%2F)
13. Building better scatterplots in Power BI reports - Tabular Editor, [https://tabulareditor.com/blog/building-better-scatterplots-in-power-bi-reports](https://www.google.com/url?sa=E&q=https%3A%2F%2Ftabulareditor.com%2Fblog%2Fbuilding-better-scatterplots-in-power-bi-reports)
14. The effect of cognitive load on decision making with graphically displayed uncertainty information - PMC, [https://pmc.ncbi.nlm.nih.gov/articles/PMC4063894/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fpmc.ncbi.nlm.nih.gov%2Farticles%2FPMC4063894%2F)
15. Cognitive Load and Cognitive Demand: How the Brain Makes Design Decisions, [https://attentioninsight.com/cognitive-load-and-cognitive-demand/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fattentioninsight.com%2Fcognitive-load-and-cognitive-demand%2F)
16. Scatter Plot Examples and Applications Explained, [https://www.fanruan.com/en/blog/scatter-plot-examples](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.fanruan.com%2Fen%2Fblog%2Fscatter-plot-examples)
17. Scatter Diagrams (Plots), Analysis & Regression - Six Sigma Study Guide, [https://sixsigmastudyguide.com/scatter-diagram/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsixsigmastudyguide.com%2Fscatter-diagram%2F)
18. How do we read scatterplots? - reposiTUm, [https://repositum.tuwien.at/bitstream/20.500.12708/195526/1/Salazar%20James%20Patrick%20-%202024%20-%20How%20do%20we%20read%20scatterplots.pdf](https://www.google.com/url?sa=E&q=https%3A%2F%2Frepositum.tuwien.at%2Fbitstream%2F20.500.12708%2F195526%2F1%2FSalazar%2520James%2520Patrick%2520-%25202024%2520-%2520How%2520do%2520we%2520read%2520scatterplots.pdf)
19. Few Guesses, More Success: 4 Principles to Reduce Cognitive Load in Forms - NN/G, [https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.nngroup.com%2Farticles%2F4-principles-reduce-cognitive-load%2F)
20. Brain Activity is Influenced by How High Dimensional Data are Represented: An EEG Study of Scatterplot Diagnostic (Scagnostics) Measures - PMC, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10805893/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fpmc.ncbi.nlm.nih.gov%2Farticles%2FPMC10805893%2F)
21. Versus – Find alternatives to a product or service | Hacker News, [https://news.ycombinator.com/item?id=24815989](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnews.ycombinator.com%2Fitem%3Fid%3D24815989)
22. Product Chart is alive - Marek Gibney, [https://www.gibney.org/product_chart_is_alive](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.gibney.org%2Fproduct_chart_is_alive)
23. Thoughts on the Resiliency of Web Projects | Hacker News, [https://news.ycombinator.com/item?id=42101190](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnews.ycombinator.com%2Fitem%3Fid%3D42101190)
24. Show HN: An interactive comparison chart of the 300 most popular tablets - Hacker News, [https://news.ycombinator.com/item?id=9144135](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnews.ycombinator.com%2Fitem%3Fid%3D9144135)
25. Show HN: DigicamFinder – open-sourced DPReview camera data | Hacker News, [https://news.ycombinator.com/item?id=35394758](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnews.ycombinator.com%2Fitem%3Fid%3D35394758)
26. SanDisk Crayola USB-C Flash Drive vs SanDisk Ultra SDDDC2 - Product Chart, [https://www.productchart.com/flashdrives/50309_vs_11148](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.productchart.com%2Fflashdrives%2F50309_vs_11148)
27. Ask HN: Why are monitors matte and laptops glossy and not the other way around?, [https://news.ycombinator.com/item?id=26044558](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnews.ycombinator.com%2Fitem%3Fid%3D26044558)
28. A visualisation method for Pareto Front approximations in many-objective optimisation - White Rose Research Online, [https://eprints.whiterose.ac.uk/id/eprint/173654/1/2021076488%20-%20A%20Visualisation%20Method%20for%20Pareto%20Front%20Approximations%20in%20Many-objective%20Optimisati.pdf](https://www.google.com/url?sa=E&q=https%3A%2F%2Feprints.whiterose.ac.uk%2Fid%2Feprint%2F173654%2F1%2F2021076488%2520-%2520A%2520Visualisation%2520Method%2520for%2520Pareto%2520Front%2520Approximations%2520in%2520Many-objective%2520Optimisati.pdf)
29. Visualizing the Pareto Frontier - SciSpace, [https://scispace.com/pdf/visualizing-the-pareto-frontier-2q06vrxoc7.pdf](https://www.google.com/url?sa=E&q=https%3A%2F%2Fscispace.com%2Fpdf%2Fvisualizing-the-pareto-frontier-2q06vrxoc7.pdf)
30. Disk Prices | Hacker News, [https://news.ycombinator.com/item?id=45587280](https://www.google.com/url?sa=E&q=https%3A%2F%2Fnews.ycombinator.com%2Fitem%3Fid%3D45587280)
31. Scatter Plot: Visual Correlations: Scatter Plot Applications in Pareto Chart Analysis, [https://www.fastercapital.com/content/Scatter-Plot--Visual-Correlations--Scatter-Plot-Applications-in-Pareto-Chart-Analysis.html](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.fastercapital.com%2Fcontent%2FScatter-Plot--Visual-Correlations--Scatter-Plot-Applications-in-Pareto-Chart-Analysis.html)
32. 1 Implications of Buyer Decision Theory for Design of eCommerce Websites By Barry G. Silverman , Mintu Bachann , Khaled Al-Akhar - Penn Engineering, [https://www.seas.upenn.edu/~barryg/bdss.PDF](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.seas.upenn.edu%2F~barryg%2Fbdss.PDF)
