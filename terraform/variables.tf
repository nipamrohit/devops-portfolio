variable "instance_type" {
  default = "t2.nano"
}

variable "ami_id" {
  default = "ami-0f5ee92e2d63afc18"  # Ubuntu 22.04 (ap-south-1)
}

variable "key_name" {
  default = "devsecops-key"
}